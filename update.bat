@echo off
:: Set the repository URL and local directory
set REPO_URL=https://github.com/Wisyam/WaAuto-Sender.git
set LOCAL_DIR=%~dp0

:: Change directory to where this script is located
cd /d %LOCAL_DIR%

:: Check if the directory is a git repository
if exist .git (
    echo Checking for updates...
    :: Fetch the latest changes
    git fetch
    :: Check if there are any updates by comparing local and remote branches
    for /f %%i in ('git rev-list HEAD...origin/main --count') do set changes=%%i
    if %changes% gtr 0 (
        echo Updates found, pulling latest changes...
        git pull origin main
    ) else (
        echo No updates found.
    )
) else (
    echo No repository found, cloning fresh copy...
    :: Remove the existing directory if necessary
    rmdir /s /q %LOCAL_DIR%\repository
    :: Clone the repository
    git clone %REPO_URL% %LOCAL_DIR%\repository
)

:: Done
echo Update process completed.
pause
