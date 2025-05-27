/**********************************************************
 * IMPORTS
 **********************************************************/
 import CONFIG from '../config/cfg_agent.js'
/**********************************************************
 * Static variables
 **********************************************************/
// TODO: Move to better structure
let own_id = null;
let own_ip = null;
let own_port = null;
let own_samp_freq=CONFIG.EXP_STREAM_FREQ;
let is_zmq_socket_configured = false;
const zmq_sock = null;

function _updateOwnId(id) {
    own_id = id;
}
function _updateOwnIp(ip) {
    own_ip = ip;
}
function _updateOwnPort(port) {
    own_port = port;
}
function _updateOwnSamplingPeriod(samp_freq) {
    own_samp_freq = samp_freq;
}
function _getOwnId() {
    return own_id;
}
function _getOwnIp() {
    return own_ip;
}
function _getOwnPort() {
    return own_port;
}

function _getOwnSamplingPeriod() {
    return own_samp_freq;
}
function _is_zmq_configured() {
    return is_zmq_socket_configured;
}
function _set_zmq_socket(socket) {
    zmq_sock = socket;
    is_zmq_socket_configured = true;
}
function _get_zmq_socket(socket) {
    return zmq_sock;
}
/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    _updateOwnId: _updateOwnId,
    _updateOwnIp: _updateOwnIp,
    _updateOwnPort: _updateOwnPort,
    _updateOwnSamplingPeriod:_updateOwnSamplingPeriod,
    _getOwnId: _getOwnId,
    _getOwnIp: _getOwnIp,
    _getOwnPort: _getOwnPort,
    _getOwnSamplingPeriod:_getOwnSamplingPeriod,
    _is_zmq_configured: _is_zmq_configured,
    _set_zmq_socket: _set_zmq_socket,
    _get_zmq_socket: _get_zmq_socket
}