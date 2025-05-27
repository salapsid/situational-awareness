#######################################################################
# PACKAGE IMPORTS
#######################################################################
import socketio
from connection.events import EVENT_FE
from api import api_connection as API_CONN
from api import api_data as API_DATA
#######################################################################
# Event handler
#######################################################################
class MyCustomNamespace(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ):
        print('Connected with frontend ID: ', sid)
        await API_CONN.api_sendStatus_fe(self, {"id": API_DATA.api_getOwnId(), "status": 1})

    def on_disconnect(self, sid):
        print('Disconnected from frontend')

    async def on_initialize(self, sid, data):
        pass
    async def on_start(self, sid, data=None):
        await API_CONN.api_start_streaming_fe(self)
    async def on_stop(self, sid):
        await API_CONN.api_stop_streaming_fe(self)