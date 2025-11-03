#!/usr/bin/env node
/*
  Node wrapper to call an LLM in priority:
  1) Hugging Face Inference API (HF_API_KEY)
  2) Ollama (local)
  3) Python fallback tools/run_hf_local.py (local transformers)

  Exposes callLLM(prompt, { model }) -> string
*/
const { spawnSync } = require('child_process');
const path = require('path');

async function callHfApi(model, prompt) {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) return null;
  const url = `https://api-inference.huggingface.co/models/${model}`;
  try {
    // Node 18+ has global fetch
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 256 } }),
    });
    if (!res.ok) throw new Error(`HF API ${res.status}`);
    const data = await res.json();
    // Some models return text or array
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      // generation outputs
      if (data.length > 0 && data[0].generated_text) return data[0].generated_text;
      return JSON.stringify(data, null, 2);
    }
    if (data.generated_text) return data.generated_text;
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return `HF API call failed: ${String(e)}`;
  }
}

function callOllama(model, prompt) {
  // try direct ollama first
  try {
    const args = ['run', model, '--prompt', prompt];
    const res = spawnSync('ollama', args, { encoding: 'utf8', timeout: 120000 });
    if (!res.error && res.status === 0) return res.stdout;
    // if not available or failed, try WSL (Windows)
  } catch (e) { /* ignore */ }
  if (process.platform === 'win32') {
    try {
      const args = ['ollama', 'run', model, '--prompt', prompt];
      const res = spawnSync('wsl', args, { encoding: 'utf8', timeout: 120000 });
      if (!res.error && res.status === 0) return res.stdout;
    } catch (e) { /* ignore */ }
  }
  return null;
}

function callPythonFallback(model, prompt) {
  // Use the repo venv python if present
  const py = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
  const script = path.join(__dirname, 'run_hf_local.py');
  try {
    const res = spawnSync(py, [script, '--model', model, '--prompt', prompt], { encoding: 'utf8', timeout: 120000 });
    if (res.error) return `Python helper error: ${res.error}`;
    return res.stdout || res.stderr || null;
  } catch (e) {
    return `Python helper failed: ${String(e)}`;
  }
}

async function callLLM(prompt, opts = {}) {
  const model = opts.model || process.env.HF_MODEL || process.env.OLLAMA_MODEL || 'gpt2';

  // 1) HF API
  if (process.env.HF_API_KEY) {
    const out = await callHfApi(model, prompt);
    if (out) return `HF_API
${out}`;
  }

  // 2) Ollama
  const oll = callOllama(model, prompt);
  if (oll) return `OLLAMA\n${oll}`;

  // 3) Python fallback
  const py = callPythonFallback(model, prompt);
  if (py) return `PYTHON_FALLBACK\n${py}`;

  return 'No LLM available: set HF_API_KEY or install Ollama or ensure .venv has transformers.';
}

module.exports = { callLLM };

// If run as CLI, accept --prompt
if (require.main === module) {
  (async () => {
    const argv = process.argv.slice(2);
    const pIndex = argv.indexOf('--prompt');
    const modelIndex = argv.indexOf('--model');
    const prompt = pIndex >= 0 ? argv[pIndex + 1] : argv.slice(0).join(' ');
    const model = modelIndex >= 0 ? argv[modelIndex + 1] : undefined;
    if (!prompt) {
      console.error('Usage: node tools/llm_client.js --prompt "..." [--model MODEL]');
      process.exit(2);
    }
    const out = await callLLM(prompt, { model });
    console.log(out);
  })();
}
