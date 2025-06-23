/******************************************************
 * Contains API to interact with mongo DB
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import utils from '../database/utils_db.js'
/******************************************************
 * Static variables and config
 *****************************************************/
async function api_connect(url) {
    await utils._connect(url);
}
async function api_disconnect(url) {
    await utils._disconnect(url);
}

async function api_pushNetwork(network_json) {
    await utils._pushNetwork(network_json);
}

async function api_addAgent(agent_json) {
    return await utils._addAgent(agent_json);
}

async function api_getNetwork() {
    return await utils._getNetwork();
}

async function api_getAgent(agent_id) {
    return await utils._getAgent(agent_id);
}

async function api_getAgentFields(agent_id, fields) {
    return await utils._getAgentFields(agent_id, fields);
}

async function api_updateAgentFields(agent_id, fields_keyval) {
    return await utils._updateAgentFields(agent_id, fields_keyval);
}

async function api_getConnectionStatus() {
    return await utils._getConnectionStatus();
}

async function api_isNetworkAvailable() {
    return await utils._isNetworkAvailable();
}

async function api_isValidAgent(agent_id) {
    return await utils._isValidAgent(agent_id);
}

async function api_pushData(agent_id, data) {
    return await utils._pushData(agent_id, data);
}

async function api_getAgentIdFromIpPort(ip, port) {
    return await utils._getAgentIdFromIpPort(ip, port);
}

async function api_deleteAgent(agent_id) {
    return await utils._deleteAgent(agent_id);
}

async function api_removeNetwork() {
    return await utils._removeNetwork();
}
/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    api_connect: api_connect,
    api_disconnect: api_disconnect,
    api_pushNetwork: api_pushNetwork,
    api_addAgent: api_addAgent,
    api_getNetwork: api_getNetwork,
    api_getAgent: api_getAgent,
    api_getAgentFields: api_getAgentFields,
    api_updateAgentFields: api_updateAgentFields,
    api_getConnectionStatus: api_getConnectionStatus,
    api_isNetworkAvailable: api_isNetworkAvailable,
    api_isValidAgent: api_isValidAgent,
    api_pushData: api_pushData,
    api_getAgentIdFromIpPort: api_getAgentIdFromIpPort,
    api_removeNetwork: api_removeNetwork,
    api_deleteAgent: api_deleteAgent
}