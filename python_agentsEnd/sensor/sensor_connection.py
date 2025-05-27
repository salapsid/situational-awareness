import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

from sensor.config.config_SPI import CONFIG_SPI
from sensor.config.config_scaling import SCALING
SPI_PORT = 0
SPI_DEVICE = 0

mcp = Adafruit_MCP3008.MCP3008(spi=SPI.SpiDev(CONFIG_SPI['SPI_PORT'],CONFIG_SPI['SPI_DEVICE']))

#num of channels to acruire data
nChannels = 3

#initialize a data vector to send to data_handler
data = {'current':[], 'voltage':[], 'power':[]}

#start acquisition
print('Reading Sensor values...')

#start main loop
def getSensorData():
	
#while True:
	values = [0]*nChannels
	for channel in range(nChannels):
		values[channel] = mcp.read_adc(channel)
	I_amps = values[0]*SCALING['channel0_scale']
	V_volts = values[2]*SCALING['channel2_scale']
	power_watts = V_volts*I_amps
	data['current']= I_amps
	data['voltage'] = V_volts
	data['power'] = power_watts
	print('*'*50)
	#print('|I (Amps):', I_amps)
	#print('|V (Volts) |' ,V_volts)
	#print('|Pd|', power_watts)
	print('data:', data)
	print('*'*50)
	return data
	#time.sleep(0.5)


getSensorData()
