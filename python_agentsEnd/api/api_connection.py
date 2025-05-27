#######################################################################
# PACKAGE IMPORTS
#######################################################################
from connection import utils_conn
from config.cfg_agent import CONFIG
#######################################################################
# API DEFINITIONS
#######################################################################
async def api_sendAck_fe(recipient, ack_code):
    await utils_conn._sendAck_fe(recipient, ack_code)

async def api_sendData_fe(recipient, data):
    await utils_conn._sendData_fe(recipient, data)

async def api_sendStatus_fe(recipient, data):
    await utils_conn._sendStatus_fe(recipient, data)

async def api_start_streaming_fe(recipient):
    if (True == CONFIG['IS_EXPERIMENTAL']):
        await utils_conn._start_exp_streaming_fe(recipient)
    else:
        await utils_conn._start_streaming_fe(recipient)

async def api_stop_streaming_fe(recipient):
    if (True == CONFIG['IS_EXPERIMENTAL']):
        await utils_conn._stop_exp_streaming_fe(recipient)
    else:
        print("Only supporting experimental mode")
