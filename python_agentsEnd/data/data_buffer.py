#######################################################################
# PACKAGE IMPORTS
#######################################################################
#######################################################################
# CLASS DEFINITIONS
#######################################################################
class myself:
    own_id = '1' #default
    own_ip = 'localhost' #default
    own_port = 3000 #default

    @classmethod
    def _updateOwnId(cls, id):
        cls.own_id = id
    @classmethod
    def _updateOwnIp(cls, ip):
        cls.own_ip = ip
    @classmethod
    def _updateOwnPort(cls, port):
        cls.own_port = port
    @classmethod
    def _getOwnId(cls):
        return cls.own_id
    @classmethod
    def _getOwnIp(cls):
        return cls.own_ip
    @classmethod
    def _getOwnPort(cls):
        return cls.own_port
