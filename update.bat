@ECHO OFF
SETLOCAL EnableDelayedExpansion

:: Define constants
SET REPO_URL=https://github.com/Wisyam/WaAuto-Sender/archive/refs/heads/main.zip
SET LOCAL_ZIP=update-latest.zip
SET EXTRACT_DIR=update-latest
SET REPLACE_DIR=REPOSITORY-main

:: Show initial message
echo.
echo Downloading Latest Update . . .

:: Download the latest update
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%REPO_URL%', '%LOCAL_ZIP%')"

:: Check if download was successful
IF EXIST "%LOCAL_ZIP%" (
    echo Download complete.
) ELSE (
    echo Download failed. Exiting.
    PAUSE
    EXIT /B
)

:: Extract the downloaded zip file
echo Extracting Files...
powershell -Command "Expand-Archive -Path '%LOCAL_ZIP%' -DestinationPath '%EXTRACT_DIR%' -Force"

:: Check if extraction was successful
IF EXIST "%EXTRACT_DIR%\%REPLACE_DIR%" (
    echo Extraction complete.
) ELSE (
    echo Extraction failed. Exiting.
    PAUSE
    EXIT /B
)

:: Replace old files with new files
echo Replacing Files...
xcopy /s /y "%EXTRACT_DIR%\%REPLACE_DIR%\" "*" >nul

:: Check if replacement was successful
IF ERRORLEVEL 0 (
    echo Files replaced successfully.
) ELSE (
    echo File replacement failed. Exiting.
    PAUSE
    EXIT /B
)

:: Clean up temporary files
echo Cleaning Up Temp Files...
powershell -Command "Remove-Item -Path '%LOCAL_ZIP%' -Force"
powershell -Command "Remove-Item -Path '%EXTRACT_DIR%' -Force -Recurse"

:: Final message
echo Successfully Updated! You may now run the program.

PAUSE
ENDLOCAL
EXIT /B
