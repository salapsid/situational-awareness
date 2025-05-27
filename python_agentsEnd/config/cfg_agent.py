#######################################################################
# PACKAGE IMPORTS
#######################################################################
INTERFACES = {
    'IPLUGD': 0,
    'OPAL_RT': 1
}
CONFIG = {
    'AGENT_NAMESPACE': 'agent_namespace',
    'IS_EXPERIMENTAL': False,
    'INTERFACE': INTERFACES['OPAL_RT'],
    'EXP_STREAM_FREQ': 1000, # in ms
    'IS_LOCALHOST': True, # make this false to open server on local ip instead of localhost
    'SENSOR_STREAM_FREQ': 1000 # in ms. Does not take effect if IS_EXPERIMENTAL is True
}
