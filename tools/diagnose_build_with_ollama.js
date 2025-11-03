#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
function runBuild() {
  return new Promise((resolve) => {
    // Use shell:true and a single command string to be cross-platform and avoid EINVAL on Windows shells
    const cmd = process.platform === 'win32' ? 'npm.cmd run build' : 'npm run build';
    let child;
    try {
      child = spawn(cmd, { shell: true });
    } catch (err) {
      return resolve({ code: 127, stdout: '', stderr: String(err) });
    }

    let stdout = '';
    let stderr = '';
    if (child.stdout) child.stdout.on('data', (d) => { stdout += d.toString(); process.stdout.write(d); });
    if (child.stderr) child.stderr.on('data', (d) => { stderr += d.toString(); process.stderr.write(d); });

    // Allow caller to set BUILD_TIMEOUT_MS env var or pass --build-timeout
    const envTimeout = parseInt(process.env.BUILD_TIMEOUT_MS || '0', 10) || 0;
    const argIndex = process.argv.indexOf('--build-timeout');
    const argTimeout = argIndex >= 0 ? parseInt(process.argv[argIndex + 1] || '0', 10) : 0;
    const timeoutMs = argTimeout || envTimeout || 0;

    let timeoutId = null;
    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        try {
          child.kill();
        } catch (e) { /* ignore */ }
        stderr += `\n[diagnostic] build killed after ${timeoutMs}ms timeout`;
        resolve({ code: 124, stdout, stderr });
      }, timeoutMs);
    }

    child.on('error', (err) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve({ code: 127, stdout, stderr: stderr + '\n' + String(err) });
    });
    child.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve({ code, stdout, stderr });
    });
  });
}

async function callOllama(prompt) {
  const model = process.env.OLLAMA_MODEL || 'codellama:latest';
  try {
    console.log('Calling Ollama...');
    const args = ['run', model, '--prompt', prompt];
    const res = spawnSync('ollama', args, { encoding: 'utf8' });
    if (res.error) throw res.error;
    if (res.status !== 0) {
      console.error('Ollama returned non-zero status:', res.status);
      console.error(res.stderr);
      return null;
    }
    return res.stdout;
  } catch (e) {
    console.error('Failed to call Ollama:', e);
    return null;
  }
}

async function callPythonHelper(prompt) {
  // Use the venv python created by hf_setup.cmd (.venv) when on Windows
  const script = path.join(__dirname, 'run_hf_local.py');
  const py = process.platform === 'win32'
    ? path.join(process.cwd(), '.venv', 'Scripts', 'python.exe')
    : 'python3';
  try {
    console.log('Calling Python HF helper...');
    const res = spawnSync(py, [script, '--model', 'gpt2', '--prompt', prompt], { encoding: 'utf8', timeout: 120000 });
    if (res.error) throw res.error;
    return res.stdout || res.stderr;
  } catch (e) {
    console.error('Failed to call Python helper:', e);
    return null;
  }
}

async function main() {
  console.log('Running npm build to capture errors...');
  const { code, stdout, stderr } = await runBuild();

  // Run type-check and lint to proactively catch issues
  console.log('\nRunning type-check (tsc --noEmit) ...');
  const tscCmd = process.platform === 'win32' ? 'npm.cmd run type-check' : 'npm run type-check';
  const tscRes = spawnSync(tscCmd, { shell: true, encoding: 'utf8', timeout: 60000 });
  const tscOut = (tscRes.stdout || '') + '\n' + (tscRes.stderr || '');

  console.log('\nRunning lint (npm run lint) ...');
  const lintCmd = process.platform === 'win32' ? 'npm.cmd run lint' : 'npm run lint';
  const lintRes = spawnSync(lintCmd, { shell: true, encoding: 'utf8', timeout: 60000 });
  const lintOut = (lintRes.stdout || '') + '\n' + (lintRes.stderr || '');

  const combined = `BUILD EXIT CODE: ${code}\n\nBUILD STDOUT:\n${stdout}\n\nBUILD STDERR:\n${stderr}\n\nTSC OUTPUT:\n${tscOut}\n\nLINT OUTPUT:\n${lintOut}`;

  const alwaysAudit = process.argv.includes('--always-audit');
  const shouldAudit = alwaysAudit || code !== 0 || (tscRes.status !== 0) || (lintRes.status !== 0);

  const prompt = `You are an expert Next.js/TypeScript developer. Provide a concise diagnostic and prioritized, safe step-by-step fixes for the repository. Use the outputs below (build, tsc, lint) to identify root causes, list files to edit, and give exact code snippets and commands to run to verify. If edits are suggested, give a small patch fragment and explain risks.\n\nRepository context (package.json scripts):\n${JSON.stringify(require(path.join(process.cwd(), 'package.json')).scripts, null, 2)}\n\nCollected outputs:\n${combined}`;

  if (!shouldAudit) {
    console.log('No errors detected in build/type-check/lint. However --always-audit not set; nothing to send to LLM.');
    if (alwaysAudit) console.log('But --always-audit is set, continuing to call LLM...');
  }

  // Check Ollama
  let ollamaAvailable = false;
  try {
    const where = spawnSync('where', ['ollama']);
    ollamaAvailable = where.status === 0;
  } catch (e) { ollamaAvailable = false; }

  let answer = null;
  if (ollamaAvailable) {
    answer = await callOllama(prompt);
  }
  if (!answer && shouldAudit) {
    answer = await callPythonHelper(prompt);
  }
  if (!answer && !shouldAudit && alwaysAudit) {
    // fallback to python helper if user explicitly requested audit
    answer = await callPythonHelper(prompt);
  }

  if (!answer) {
    console.error('No diagnostic answer produced.');
    process.exit(2);
  }

  const outFile = path.join(process.cwd(), 'tools', 'build_diagnostic.txt');
  fs.writeFileSync(outFile, answer, 'utf8');
  console.log('\nDiagnostic written to', outFile);
  console.log('\n--- Answer ---\n');
  console.log(answer);
}

main().catch((e) => { console.error(e); process.exit(1); });
