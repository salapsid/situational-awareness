/******************************************************
 * IMPORTS
 *****************************************************/
import {EVENT_AG, ACK_CODE} from '../agentsEnd/connection/events.js';
import {EVENT_FE} from '../frontend/connection/events.js';
import API_CONN_AG from '../api/api_connection_ag.js';
import API_CONN_FE from '../api/api_connection_fe.js';
import UTIL_RES_FE from '../frontend/resources/utils_res.js';
/******************************************************
 * FUNCTION DEFINITIONS
 *****************************************************/
async function _sendEvent(bundle) {
    if (null != bundle) {
        let json = bundle;//JSON.parse(bundle); // TODO: Seems no need to parse json
        let event = null;
        let recipients = null;
        let data = null;
        if (json != null) {
            if (true == json.hasOwnProperty('event')) {
                event = json.event;
                if (true == json.hasOwnProperty('id')) {
                    recipients = json.id;
                }
                if (true == json.hasOwnProperty('data')) {
                    data = json.data;
                }
                API_CONN_AG.api_sendEvent_ag(String(event), recipients, data);
            }
        }
    }
}

async function _sendData_ag_to_fe(data) {
    const frontendMap = UTIL_RES_FE.getMap();
    // TODO: We will broadcast as of now. This is expeerimental
    if (!frontendMap) {
        return;
    }
    // Need to braodcast to all agents
    frontendMap.forEach((value, key, mapObj) => {
        const fe = mapObj.get(key);
        const fe_socket = fe.get(UTIL_RES_FE.mapField.SOCKET)
        fe_socket.emit(EVENT_FE.DATA, data);
    });
}

async function _sendStatus_ag_to_fe(data) {
    const frontendMap = UTIL_RES_FE.getMap();
    // TODO: We will broadcast as of now. This is expeerimental
    if (!frontendMap) {
        return;
    }
    // Need to braodcast to all agents
    frontendMap.forEach((value, key, mapObj) => {
        const fe = mapObj.get(key);
        const fe_socket = fe.get(UTIL_RES_FE.mapField.SOCKET)
        fe_socket.emit(EVENT_FE.STATUS_CHANGE, data);
    });
}

export default {
    _sendEvent: _sendEvent,
    _sendData_ag_to_fe: _sendData_ag_to_fe,
    _sendStatus_ag_to_fe: _sendStatus_ag_to_fe
}