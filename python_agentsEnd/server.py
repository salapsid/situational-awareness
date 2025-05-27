#######################################################################
# PACKAGE IMPORTS
#######################################################################
import socketio
from aiohttp import web
from connection.event_handler import MyCustomNamespace
from config.cfg_agent import CONFIG
from api import api_data as API_DATA
import sys
import socket # To get local ip address
#######################################################################
# FUNCTION DEFINITIONS
#######################################################################
def parseArguments():
    num_arg = len(sys.argv)
    # Default values
    id = '1'
    ip = 'localhost'
    port = 3000
    if (num_arg >= 4):
        id = sys.argv[1]
        ip = sys.argv[2]
        port = sys.argv[3]
    else:
        print('Not enough arguments, setting to default...')
        if (False == CONFIG['IS_LOCALHOST']):
            hostname = socket.gethostname()
            ip = socket.gethostbyname(hostname)
            print('overriding ip to ', ip)
        else:
            ip = 'localhost'
    return id, ip, port

#######################################################################
# CREATE SOCKET IO SERVER
#######################################################################
# Parse command line arguments
own_id, own_ip, own_port = parseArguments()
API_DATA.api_updateOwnId(own_id)
API_DATA.api_updateOwnIp(own_ip)
API_DATA.api_updateOwnPort(own_port)

sio = socketio.AsyncServer()
app  = web.Application()
sio.attach(app)
sio.register_namespace(MyCustomNamespace('/' + CONFIG['AGENT_NAMESPACE']))
web.run_app(app=app, port=own_port, host=own_ip)