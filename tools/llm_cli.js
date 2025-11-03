#!/usr/bin/env node
const { callLLM } = require('./llm_client');

(async () => {
  const argv = process.argv.slice(2);
  const pIndex = argv.indexOf('--prompt');
  const modelIndex = argv.indexOf('--model');
  const prompt = pIndex >= 0 ? argv[pIndex + 1] : argv.join(' ');
  const model = modelIndex >= 0 ? argv[modelIndex + 1] : undefined;
  if (!prompt) {
    console.error('Usage: node tools/llm_cli.js --prompt "..." [--model MODEL]');
    process.exit(2);
  }
  const out = await callLLM(prompt, { model });
  console.log(out);
})();
