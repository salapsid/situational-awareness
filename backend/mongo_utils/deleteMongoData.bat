FOR /F "delims== tokens=1,2" %%G IN (params.txt) DO SET %%G=%%H
PAUSE
RMDIR /S %DATA_PATH%
MKDIR "C:\UMN\Lab\Project\mongoDB\data\db"
DEL %LOG_PATH%