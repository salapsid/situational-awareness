/******************************************************
 * Contains API to interact with Agents
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import UTILS from '../router/utils_router.js';
/******************************************************
 * API DEFINITIONS
 *****************************************************/
async function api_sendEvent(data_bundle) {
    await UTILS._sendEvent(data_bundle);
}

async function api_sendData_ag_to_fe(data) {
    await UTILS._sendData_ag_to_fe(data);
}

async function api_sendStatus_ag_to_fe(data) {
    await UTILS._sendStatus_ag_to_fe(data);
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    api_sendEvent: api_sendEvent,
    api_sendData_ag_to_fe: api_sendData_ag_to_fe,
    api_sendStatus_ag_to_fe: api_sendStatus_ag_to_fe
}