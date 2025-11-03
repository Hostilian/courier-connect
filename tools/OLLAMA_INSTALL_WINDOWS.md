# Installing Ollama on Windows (WSL vs native)

This note explains options to install Ollama on Windows and recommendations for which route to pick.

Summary
- WSL (recommended for development): Run Ollama in WSL (Ubuntu) for best compatibility with Linux-native builds and models.
- Native Windows: If Ollama provides a native installer for Windows, use it for a simpler setup. Native support availability may change—check https://ollama.com/.

1) WSL (Windows Subsystem for Linux) — recommended

Pros:
- Works with Linux-first tooling and models.
- Easier to install packages and GPU drivers (if you have WSLg/WSL2 with GPU support).
- Matches Linux server behavior.

Cons:
- Slightly more setup if you're not using WSL already.

Steps:

1. Install WSL and Ubuntu (if not already):

```powershell
wsl --install -d ubuntu
```

2. Open the WSL terminal (Ubuntu) and follow Ollama Linux install instructions from https://ollama.com/docs (they usually provide an apt or script-based installer).

3. Ensure Ollama is running inside WSL. You can test with:

```bash
ollama version
ollama run llama2:latest --prompt "hello"
```

4. From Windows you can call WSL commands directly:

```cmd
wsl ollama run llama2:latest --prompt "Explain my Next.js build error"
```

Notes on GPU: To use a GPU from WSL you must have the appropriate NVIDIA drivers and WSLg configured.

2) Native Windows (if available)

Pros:
- Simpler for Windows-only devs.

Cons:
- May lag behind Linux features. Check Ollama docs.

Steps:

1. Check https://ollama.com/ for a Windows installer or instructions.
2. Install and verify with `ollama version` in cmd.exe or PowerShell.

3) Using Ollama with this repo

- Once Ollama is installed and a model is available (e.g., `llama2`, `codellama`), you can run an example from the repo root:

```cmd
wsl ollama run codellama:latest --prompt "Explain why 'next build' fails in this repo and suggest fixes. Include files and line numbers where relevant."
```

Or, if native:

```cmd
ollama run codellama:latest --prompt "Explain why 'next build' fails in this repo and suggest fixes."
```

4) Troubleshooting
- If the model download fails, ensure you have enough disk space and network access.
- For permission issues, run the WSL terminal as your user and follow Ollama permissions guidance.

Next steps: I will add a Node.js diagnostic script that runs `npm run build`, captures the build stderr, and (if Ollama is available) sends the error text to Ollama with a prompt asking for suggested fixes. If Ollama isn't found, the script will fall back to using `tools/run_hf_local.py`.
