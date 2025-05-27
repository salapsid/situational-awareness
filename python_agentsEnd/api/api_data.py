#######################################################################
# Contains API to interact with local data buffer
#######################################################################
#######################################################################
# PACKAGE IMPORTS
#######################################################################
from data.data_buffer import myself as data_buff
#######################################################################
# API DEFINITIONS
#######################################################################
def api_updateOwnId(id):
    data_buff._updateOwnId(str(id))

def api_updateOwnIp(ip):
    data_buff._updateOwnIp(str(ip))

def api_updateOwnPort(port):
    data_buff._updateOwnPort(int(port))

def api_getOwnId():
    return data_buff._getOwnId()

def api_getOwnIp():
    return data_buff._getOwnIp()

def api_getOwnPort():
    return data_buff._getOwnPort()