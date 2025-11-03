@echo off
REM Windows (cmd.exe) helper to create a venv and install HF helper requirements
setlocal enabledelayedexpansion

if not defined PYTHON_EXE (
  where python >nul 2>&1
  if %ERRORLEVEL%==0 (
    set PYTHON_EXE=python
  ) else (
    echo Python not found on PATH. Please install Python 3.10+ and retry.
    exit /b 1
  )
)

echo Creating virtual environment in .\.venv (if missing)
if exist .venv\Scripts\python.exe (
  echo Virtual environment already exists; skipping creation.
) else (
  %PYTHON_EXE% -m venv .venv
  if %ERRORLEVEL% neq 0 (
    echo Failed to create virtualenv. Ensure Python supports venv.
    exit /b 1
  )
)

echo Activating virtualenv and installing requirements
.venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r tools\requirements.txt

echo
echo Done. To use the HF helper run:
echo    .venv\Scripts\activate.bat
echo    python tools\run_hf_local.py --help
echo
echo To use Hugging Face Inference API, set environment variable HF_API_KEY with your key:
echo    set HF_API_KEY=your_api_key_here

exit /b 0
