/******************************************************
 * IMPORTS
 *****************************************************/
import UTIL_RES from '../resources/utils_res.js';
import API_DATABASE from '../../api/api_database.js';
/******************************************************
 * STATIC VARIABLES
 *****************************************************/
const LOG_PREFIX = 'B2A: utils_conn: '
const ENABLE_VERBOSE = true;
/******************************************************
 * EVENT HANDLERS
 *****************************************************/
async function _sendEvent_ag(event, recipient=null, data=null) {
    const agentMap = UTIL_RES.getMap();
    if (!agentMap) {
        return;
    }
    if (null == recipient) {
        // Need to braodcast to all agents
        agentMap.forEach((value, key, mapObj) => {
            const agent = mapObj.get(key);
            const ag_socket = agent.get(UTIL_RES.mapField.SOCKET)
            if (null == data) {
                ag_socket.emit(String(event));
            } else {
                ag_socket.emit(String(event), data);
            }
        });
    } else {
        // First get map ID to IP: Fetch from mongo
        let res = await API_DATABASE.api_getConnectionStatus();
        if (true == res) {
            let ntwrk_status = await API_DATABASE.api_isNetworkAvailable();
            if (true == ntwrk_status) {
                let ip = await API_DATABASE.api_getAgentFields(recipient, 'ip port');
                if (null != ip) {
                    // Now map IP to socket: TODO: Find a better way to do this
                    agentMap.forEach((value, key, mapObj) => {
                        const agent = mapObj.get(key);
                        const agent_ip = String(agent.get(UTIL_RES.mapField.IP));
                        if (agent_ip.includes(String(ip[0].ip)) & (agent_ip.includes(String(ip[0].port)))) {
                            const ag_socket = agent.get(UTIL_RES.mapField.SOCKET);
                            if (null == data) {
                                ag_socket.emit(String(event));
                            } else {
                                ag_socket.emit(String(event), data);
                            }
                        }
                    });
                }
            }
        }
    }
}

async function _getIdFromDatabase(uri) {
    const agentMap = UTIL_RES.getMap();
    if (!agentMap) {
        return null;
    }
    let res = await API_DATABASE.api_getConnectionStatus();
    if (false == res) {
        return null;
    }
    let ntwrk_status = await API_DATABASE.api_isNetworkAvailable();
    if (false == ntwrk_status) {
        return null;
    }
    let ip = await API_DATABASE.api_getAgentFields(agent, 'ip port');
    if (null == ip) {
        return null;
    }
    // Now map IP to socket: TODO: Find a better way to do this
    agentMap.forEach((value, key, mapObj) => {
        const agent = mapObj.get(key);
        const agent_ip = String(agent.get(UTIL_RES.mapField.IP));
        if (agent_ip.includes(String(ip[0].ip)) & (agent_ip.includes(String(ip[0].port)))) {
            const ag_socket = agent.get(UTIL_RES.mapField.SOCKET);
            if (null == data) {
                ag_socket.emit(String(event));
            } else {
                ag_socket.emit(String(event), data);
            }
        }
    });


}
/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    _sendEvent_ag: _sendEvent_ag
}
