/******************************************************
 * Contains API to interact with mongo DB
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import UTILS_CONN_AG from '../agentsEnd/connection/utils_conn.js';
/******************************************************
 * API definitions
 *****************************************************/
async function api_sendEvent_ag(event, recipient=null, data=null) {
    await UTILS_CONN_AG._sendEvent_ag(event, recipient, data);
}

export default {
    api_sendEvent_ag: api_sendEvent_ag
}