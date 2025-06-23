FOR /F "delims== tokens=1,2" %%G IN (params.txt) DO SET %%G=%%H
PAUSE
RMDIR /S %DATA_PATH%
MKDIR %DATA_PATH%
DEL %LOG_PATH%