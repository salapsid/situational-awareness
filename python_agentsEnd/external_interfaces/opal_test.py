from external_interfaces.opal_rt import opal_rt_client
from external_interfaces.opal_config import OPAL_CONFIG
import numpy as np

interface = opal_rt_client(OPAL_CONFIG['IP'], OPAL_CONFIG['PORT'])
data = interface.get_data()
print(data)