/******************************************************
 * Contains API to interact with front end
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import UTILS_CONN_FE from '../frontEnd/connection/utils_conn.js';
/******************************************************
 * API definitions
 *****************************************************/
async function api_sendData_fe(recipient, data=null) {
    await UTILS_CONN_FE._sendData_fe(recipient, data);
}

async function api_start_network_streaming_fe(recipient, data=null) {
    await UTILS_CONN_FE._start_network_streaming_fe(recipient, data);
}

async function api_stop_network_streaming_fe() {
    await UTILS_CONN_FE._stop_network_streaming_fe();
}

export default {
    api_sendData_fe: api_sendData_fe,
    api_start_network_streaming_fe: api_start_network_streaming_fe,
    api_stop_network_streaming_fe: api_stop_network_streaming_fe
}