@echo off
REM checks if ollama is installed and prints guidance
where ollama >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Ollama is installed. Version:
  ollama version || echo (unable to read version)
  exit /b 0
)

echo Ollama not found in PATH.
echo Please install Ollama from https://ollama.com/
echo On Windows you can use WSL or the native installer if available.
echo After installing, re-open your terminal and run this script again.
exit /b 1
