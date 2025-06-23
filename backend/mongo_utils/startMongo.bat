::@echo off
FOR /F "delims== tokens=1,2" %%G IN (params.txt) DO SET %%G=%%H
PAUSE
call "%INSTALLATION_PATH%" --dbpath=%DATA_PATH% --logpath=%LOG_PATH%
PAUSE