@ECHO OFF
SETLOCAL EnableDelayedExpansion

:: Set up variables
SET "REPO_URL=https://github.com/Wisyam/WaAuto-Sender/archive/refs/heads/main.zip"
SET "ZIP_FILE=WaAuto-Sender-latest.zip"

:: Output message
echo.
echo.
echo Downloading Latest Update . . .
powershell (New-Object System.Net.WebClient).Downloadfile('%REPO_URL%', '%ZIP_FILE%')
echo Extracting Files
powershell.exe Expand-Archive -Path %ZIP_FILE% -DestinationPath . -Force
echo Replacing Files
:: Copy extracted files to the current directory
for /d %%D in (WaAuto-Sender-*) do xcopy /s /e /y "%%D\*" ".\"
echo Cleaning Up Temp Files !
powershell Remove-Item -Path %ZIP_FILE% -Force
:: Remove extracted directory
for /d %%D in (WaAuto-Sender-*) do powershell Remove-Item -Path "%%D" -Force -Recurse
echo Successfully Updated ! You may Now Run The Program.

ENDLOCAL
PAUSE
EXIT /B
