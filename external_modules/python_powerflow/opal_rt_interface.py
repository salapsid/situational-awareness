#######################################################################
# PACKAGE IMPORTS
#######################################################################
import socket
#######################################################################
# CLASS DEFINITIONS
#######################################################################
class opal_rt_client:
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port
        self.sock = None
    def init_interface(self):
        if (None is self.sock):
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.ip_address, self.port))

    def enable(self):
        data, addr = self.sock.recvfrom(1024)
        print("Message: ", data)

class opal_rt_server:
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    def init_interface(self):
        if (None is self.sock):
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    def send_data(self, data):
        self.sock.sendto(data, (self.ip_address, self.port))