/******************************************************
 * Contains API to interact with mongo DB
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import utils_conn from '../connection/utils_conn.js'
import CONFIG from '../config/cfg_agent.js'
/******************************************************
 * API definitions
 *****************************************************/
async function api_sendAck_fe(recipient, ack_code) {
    utils_conn._sendAck_fe(recipient, ack_code);
}

async function api_sendData_fe(recipient, data) {
    utils_conn._sendData_fe(recipient, data);
}

async function api_sendStatus_fe(recipient, data) {
    utils_conn._sendStatus_fe(recipient, data);
}

async function api_start_streaming_fe(recipient) {
    if (true == CONFIG.IS_EXP_SYSTEM_PRESENT) {
        utils_conn._emulate_sensor(recipient);
    } else if (true == CONFIG.IS_EXPERIMENTAL) {
        utils_conn._start_exp_streaming_fe(recipient);
    } else {
        console.log("Only supporting experimental mode");
    }
}

async function api_stop_streaming_fe(recipient) {
    if (true == CONFIG.IS_EXPERIMENTAL) {
        utils_conn._stop_exp_streaming_fe(recipient);
    } else {
        console.log("Only supporting experimental mode");
    }
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    api_sendAck_fe: api_sendAck_fe,
    api_sendData_fe: api_sendData_fe,
    api_start_streaming_fe:api_start_streaming_fe,
    api_stop_streaming_fe: api_stop_streaming_fe,
    api_sendStatus_fe: api_sendStatus_fe
}
