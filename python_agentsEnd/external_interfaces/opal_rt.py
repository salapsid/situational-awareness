#######################################################################
# PACKAGE IMPORTS
#######################################################################
import socket
import json
#######################################################################
# CLASS DEFINITIONS
#######################################################################
class opal_rt_client:
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.ip_address, self.port))
    def init_interface(self):
        if (None is self.sock):
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.ip_address, self.port))
    def get_data(self):
        data, addr = self.sock.recvfrom(1024)
        return data
