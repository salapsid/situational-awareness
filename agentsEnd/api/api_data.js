/******************************************************
 * Contains API to interact with local data buffer
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import data_buff from '../data/data_buffer.js';
/******************************************************
 * API definitions
 *****************************************************/
function api_updateOwnId(id) {
    data_buff._updateOwnId(String(id));
}
function api_updateOwnIp(ip) {
    data_buff._updateOwnIp(String(ip));
}
function api_updateOwnPort(port) {
    data_buff._updateOwnPort(Number(port));
}
function api_updateOwnSamplingPeriod(samp_freq) {
    return data_buff._updateOwnSamplingPeriod(samp_freq);
}
function api_getOwnId() {
    return data_buff._getOwnId();
}
function api_getOwnIp() {
    return data_buff._getOwnIp();
}
function api_getOwnPort() {
    return data_buff._getOwnPort();
}
function api_getOwnSamplingPeriod() {
    return data_buff._getOwnSamplingPeriod();
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    api_updateOwnId: api_updateOwnId,
    api_updateOwnIp: api_updateOwnIp,
    api_updateOwnPort:api_updateOwnPort,
    api_updateOwnSamplingPeriod:api_updateOwnSamplingPeriod,
    api_getOwnId: api_getOwnId,
    api_getOwnIp: api_getOwnIp,
    api_getOwnPort: api_getOwnPort,
    api_getOwnSamplingPeriod:api_getOwnSamplingPeriod


}