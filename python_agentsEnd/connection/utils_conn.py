#######################################################################
# PACKAGE IMPORTS
#######################################################################
from connection.events import EVENT_FE
from data import data_handler
from config.cfg_agent import CONFIG
import asyncio
#######################################################################
# PACKAGE IMPORTS
#######################################################################
if (True == CONFIG['IS_EXPERIMENTAL']):
    stream_freq_sec = CONFIG['EXP_STREAM_FREQ']/1000.
else:
    stream_freq_sec = CONFIG['SENSOR_STREAM_FREQ']/1000.

stream_timer = data_handler.dataStreamer(interval=stream_freq_sec, recipient=None,
                                         event=EVENT_FE['DATA'])
#######################################################################
# PACKAGE IMPORTS
#######################################################################
async def _sendAck_fe(recipient, ack_code):
    if (recipient is not None):
        await recipient.emit(EVENT_FE['ACK'], ack_code)

async def _sendData_fe(recipient, data):
    if (recipient is not None):
        await recipient.emit(EVENT_FE['DATA'], data)

async def _sendStatus_fe(recipient, data):
    if (recipient is not None):
        await recipient.emit(EVENT_FE['STATUS_CHANGE'], data)

async def _start_exp_streaming_fe(recipient):
    stream_timer.recipient = recipient
    stream_timer.start()

async def _start_streaming_fe(recipient):
    stream_timer.recipient = recipient
    stream_timer.start()

async def _stop_exp_streaming_fe(recipient):
    if (stream_timer is not None):
        stream_timer.stop()
