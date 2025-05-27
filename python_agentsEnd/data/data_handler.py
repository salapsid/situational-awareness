#######################################################################
# PACKAGE IMPORTS
#######################################################################
from config.cfg_agent import CONFIG, INTERFACES
from datetime import datetime
from datetime import timezone
from api import api_data as API_DATA
from api import api_connection as API_CONN
if (False == CONFIG['IS_EXPERIMENTAL']):
    if (INTERFACES['OPAL_RT'] == CONFIG['INTERFACE']):
        from external_interfaces.opal_rt import opal_rt_client
        from external_interfaces.opal_config import OPAL_CONFIG
    elif (INTERFACES['IPLUGD'] == CONFIG['INTERFACE']):
        from sensor import sensor_connection as SENSOR_CONN
import json as JSON
from threading import Timer
#import numpy as np
import random
import asyncio
import numpy as np
#######################################################################
# CLASS DEFINITIONS
#######################################################################
class dataStreamer():
    def __init__(self, interval, recipient, event):
        self._timer = None
        self.interval = interval
        self.is_running = False
        self.recipient = recipient
        self.event = event
        if (INTERFACES['OPAL_RT'] == CONFIG['INTERFACE']):
            self.interface = opal_rt_client(OPAL_CONFIG['IP'], OPAL_CONFIG['PORT'])
        elif (INTERFACES['IPLUGD'] == CONFIG['INTERFACE']):
            self.interface = None  # TODO: Clean up code
        else:
            self.interface = None

    def _run(self):
        self.is_running = False
        self.start()
        if (INTERFACES['OPAL_RT'] == CONFIG['INTERFACE']):
            if (None is not self.interface):
                raw_data = self.interface.get_data().decode('utf-8')
                print('Message = ', raw_data)
                data = getExperimentalData(power=raw_data[0])
        elif (True == CONFIG['IS_EXPERIMENTAL']):
            data = getExperimentalData(power=random.random())
        else:
            sensor_data = SENSOR_CONN.getSensorData()
            current = sensor_data['current']
            voltage = sensor_data['voltage']
            power = sensor_data['power']
            data = getExperimentalData(current=current, voltage=voltage, power=power)
        print("data sent:", data)
        asyncio.run(API_CONN.api_sendData_fe(self.recipient, data))

    def start(self):
        if (False == self.is_running):
            self._timer = Timer(self.interval, self._run)
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running = False
#######################################################################
# FUNCTION DEFINITION
#######################################################################
def getExperimentalData(current=None, voltage=None, power=0.):
    curr_time = datetime.now()
    utc_time = curr_time.replace(tzinfo=timezone.utc)
    time_stamp = utc_time.timestamp()
    id = API_DATA.api_getOwnId()
    if (None == current):
        current = 0.
    if (None == voltage):
        voltage = 0.
    data = {
        "timestamp": time_stamp,
        "id": id,
        "version":"2",
        "unit":"pu",
        "ang_unit":"rad",
        "base_mva":100,
        "base_kv":135,
        "gen_bus":{
            "is_gen_bus":1,
            "status":1,
            "pg":23.54,
            "qg":0,
            "max_pg":80,
            "min_pg":0,
            "max_qg":150,
            "min_qg":-20,
            "vg":1,
            "mbase":100
        },
        "load_bus":{
            "is_load_bus":1,
            "status":1,
            "pd":power, # Changing only this foe demo purpose
            "qd":0
        },
        "v_mag":voltage, #data from Sensor
        "v_ang":0,
        "i_mag":current
    }
    print("data is:", power)
    return JSON.dumps(data)
