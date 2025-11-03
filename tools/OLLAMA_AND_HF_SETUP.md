# Ollama and Hugging Face helper setup (Windows)

This folder contains small helpers to get you started using Ollama (local LLM host) and Hugging Face (Inference API or local transformers) from this repo on Windows `cmd.exe`.

Files added:
- `check_ollama.cmd` — checks whether `ollama` is on PATH and prints version.
- `hf_setup.cmd` — creates a `.venv`, installs Python requirements from `tools/requirements.txt`.
- `run_hf_local.py` — Python helper that calls HF Inference API when `HF_API_KEY` is set, otherwise runs a local `transformers` pipeline (default `gpt2`).

Quick steps (Windows cmd.exe):

1. Check Ollama

   Open cmd.exe and run:

```cmd
tools\check_ollama.cmd
```

2. Install Ollama (if not installed)

- Visit https://ollama.com/ and follow the Windows/WSL instructions.
- Ollama is useful to run models like Llama 2 and CodeLlama locally and query them from Node or Python.

3. Setup Hugging Face helper

```cmd
tools\hf_setup.cmd
```

This will create `.venv`, activate it, and install required Python packages.

4. Run the HF helper (with Inference API)

Set your Hugging Face API key and run:

```cmd
set HF_API_KEY=hf_xxxYOURKEYxxx
.venv\Scripts\activate.bat
python tools\run_hf_local.py --model gpt2 --prompt "Fix my Next.js build error"
```

5. Run the HF helper (local transformers)

If you don't set `HF_API_KEY`, `run_hf_local.py` will attempt to use `transformers` locally. Note: large models require GPU and disk space.

6. Using Ollama from Node/Terminal

Once Ollama is installed and running, you can run models like:

```cmd
ollama run llama2:latest --prompt "Explain this Next.js error and suggest a fix"
```

Or use Ollama's HTTP/CLI to integrate into your debugging scripts.

Notes and next steps:
- If you'd like, I can add a small Node.js script that queries Ollama or the HF API from within this repo and wire an npm script.
- For production or large-scale usage, prefer Hugging Face hosted inference or a paid Ollama plan; these helpers are for development and troubleshooting.

Running the automated build diagnostic (Ollama + fallback)

I added a Node helper that runs `npm run build`, captures the output, and asks Ollama (if installed) for a diagnosis. If Ollama is not available it falls back to the Python Hugging Face helper.

From the repo root (cmd.exe):

```cmd
npm run tools:diagnose-ollama
```

What it does:
- Runs `npm run build` and captures stdout/stderr.
- If the build fails, forms a prompt containing the build output and calls `ollama run <model>` if `ollama` is on PATH.
- If Ollama isn't available, it tries `python .venv\Scripts\python.exe tools\run_hf_local.py ...` (make sure to run `tools\hf_setup.cmd` first).
- The diagnostic text is written to `tools/build_diagnostic.txt` and also printed to your terminal.

Interpreting results:
- The model will attempt to identify the root cause and suggest fixes. Treat suggestions as guidance — verify changes before applying.
- If the model suggests file edits, open those files and review changes. I can help generate patches if you want.

New CLI & environment setup (ready-to-use)

1) `.env.example` added at repo root — copy to `.env.local` and set your API keys there (or use `set HF_API_KEY=...` in cmd):

```
copy .env.example .env.local
REM edit .env.local and set HF_API_KEY
```

2) Node LLM client & CLI
- `tools/llm_client.js` — unified client that prefers HF API, then Ollama, then Python fallback.
- `tools/llm_cli.js` — small CLI wrapper. Example:

```cmd
npm run tools:llm-cli -- --prompt "Explain how to fix a Next.js build error"
```

3) New npm scripts (convenience)
- `npm run tools:ollama-check` — quick Ollama PATH check
- `npm run tools:hf-setup` — Windows venv + pip install (same as running `tools\hf_setup.cmd`)
- `npm run tools:llm-cli -- --prompt "..."` — run unified LLM client

See `package.json` scripts for exact names.

4) Ready but no keys
- Everything is wired up to use HF if `HF_API_KEY` is set. I did NOT add any API keys. Set `HF_API_KEY` locally in `.env.local` or your shell before running the CLI.

If you want, I can now run a proactive audit using the new `--always-audit` diagnostic (it will prefer HF API if you set `HF_API_KEY`, otherwise it will try Ollama or local transformers). If you want the highest-quality quick result, set `HF_API_KEY` and I'll run it and summarize the recommendations.


