###################################################################
# IMPORTS
###################################################################
from pypower.api import case30, ppoption, runpf, printpf, loadcase
from pypower import idx_bus, idx_gen, idx_brch
import signal
import time
import zmq
import copy
from threading import Timer
from sys_config import CONFIG
import numpy as np
from datetime import datetime
from datetime import timezone
import json as JSON
import opal_rt_interface as OPAL_INTERFACE
###################################################################
# VARIABLE DECLARATION
###################################################################
class system:
    def __init__(self, ppc):
        self.ppc = ppc
        self.original_load = self.ppc['bus'][:, idx_bus.BUS_I:idx_bus.QD+1]
    def run_system(self):
        (result, success) = runpf(self.ppc)
        if (True != success):
            print('Warning: Power flow did not converge. Please check')
        return result

    def update_system_states(self, result):
        self.ppc['bus'][:, idx_bus.VM] = result['bus'][:, idx_bus.VM]
        self.ppc['bus'][:, idx_bus.VA] = result['bus'][:, idx_bus.VA]
        self.ppc['gen'][:, idx_gen.PG] = result['gen'][:, idx_gen.PG]
        self.ppc['gen'][:, idx_gen.QG] = result['gen'][:, idx_gen.QG]

    def change_loads(self, mu, sigma):
        get_non_zero_load = lambda bus: bus[idx_bus.PD] != 0.
        nz_load_mask = np.apply_along_axis(get_non_zero_load, 1, self.original_load)
        change_load = lambda mean: mean[idx_bus.PD:idx_bus.QD+1]+np.random.multivariate_normal(mu, sigma)
        new_load = np.apply_along_axis(change_load, 1, self.original_load[nz_load_mask])
        self.ppc['bus'][nz_load_mask, idx_bus.PD:idx_bus.QD+1] = new_load

class dataStreamer():
    def __init__(self, interval, ip_port, system, mu=np.zeros((2,)), sigma=(1e-4)*np.eye(2)):
        self._timer = None
        self.interval = interval
        self.is_running = False
        self.system = system
        self.mu = mu
        self.sigma = sigma
        self.zmq_context = zmq.Context()
        self.zmq_socket = self.zmq_context.socket(zmq.PUB)
        self.zmq_socket.bind(ip_port)
        self.opal_interface = OPAL_INTERFACE.opal_rt_server(CONFIG['OPAL_RT_INTERFACE_IP'],
                                                            CONFIG['OPAL_RT_INTERFACE_PORT'])

    def _run(self):
        self.is_running = False
        self.start()
        # Run the system
        result = self.system.run_system()
        # Update the system with current values
        self.system.update_system_states(result)
        # Broadcast message
        self.broadcast_data()
        # Change load
        self.system.change_loads(self.mu, self.sigma)

    def start(self):
        if (False == self.is_running):
            self._timer = Timer(self.interval, self._run)
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running = False

    def create_message(self, topic, pd, qd, vm, va, timestamp=None):
        time_stamp = None
        if (timestamp is None):
            curr_time = datetime.now()
            utc_time = curr_time.replace(tzinfo=timezone.utc)
            time_stamp = utc_time.timestamp()
        else:
            time_stamp = timestamp
        message = {
            "timestamp": time_stamp,
            "id": topic,
            "pd": pd,
            "qd": qd,
            "v_mag": vm,
            "v_ang": va
        }
        return JSON.dumps(message)

    def broadcast_data(self):
        print('Broadcasting...')
        curr_time = datetime.now()
        utc_time = curr_time.replace(tzinfo=timezone.utc)
        time_stamp = utc_time.timestamp()
        for idx in range(len(self.system.ppc['bus'])):
            topic = str(int(self.system.ppc['bus'][idx, idx_bus.BUS_I]))
            message = self.create_message(topic, self.system.ppc['bus'][idx, idx_bus.PD],
                                          self.system.ppc['bus'][idx, idx_bus.QD],
                                          self.system.ppc['bus'][idx, idx_bus.VM],
                                          self.system.ppc['bus'][idx, idx_bus.VA],
                                          time_stamp)
            self.zmq_socket.send_string("%s %s" % (topic, message))
        # self.opal_interface.send_data(str.encode("message"))

###################################################################
# CODE STARTS HERE
###################################################################
# ppc = case33bw_mod()
ppc = loadcase("C:/UMN/Aelios/situationalAwareness/external_modules/python_powerflow/case33bw_mod")
sys = system(ppc)
# Initialize timer and start sending messages
print(CONFIG['LOAD_CHG_FREQ'])
streamer = dataStreamer(interval=CONFIG['LOAD_CHG_FREQ'], ip_port=CONFIG['IP_PORT_ADDRESS'], system=sys)
streamer.start()
# sys.change_loads(np.zeros((2,)), (1e-2)*np.eye(2))

