/******************************************************
 * IMPORTS
 *****************************************************/
import {EVENT_FE} from './events.js';
import API_DB from '../../api/api_database.js';
import CONFIG from '../../config/cfg_backend.js';
import fs from 'fs';
/******************************************************
 * STATIC VARIABLES
 *****************************************************/
 let stream_timer = null;
 const NETWORK_FILE_PATH = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/case33bw_recons.json';
/******************************************************
 * EVENT HANDLERS
 *****************************************************/
async function _sendAck_fe(recipient, ack_code) {
    if (null != recipient) {
        recipient.emit(EVENT_FE.ACK, ack_code);
    }
}

async function _sendData_fe(recipient, data) {
    if (null != recipient) {
        recipient.emit(EVENT_FE.DATA, data);
    }
}

async function _start_network_streaming_fe(recipient){
    clearInterval(stream_timer);
    stream_timer = null;
    stream_timer = setInterval(() => {
                            API_DB.api_getNetwork().then((network) => {
                                console.log('Sending new network...');
                                recipient.emit(EVENT_FE.NETWORK, JSON.stringify(network));
                            });
                           
        }, CONFIG.NETWORK_STREAMING_FREQ);
    
}
async function _start_network_streaming_fe_prev(recipient, data) {
    // TODO: IN EXPERIMENTAL MODE, WE GET THE NETWORK FROM DATABASE
    // SO DATA IS UNUSED AS OF NOW. MIGHT CHANGE LATER.
    if (null == stream_timer) {
        stream_timer = setInterval(() => {
            try {
                if (fs.existsSync(NETWORK_FILE_PATH)) {
                    //file exists
                    const buffer = fs.readFileSync(NETWORK_FILE_PATH);
                    const data = JSON.parse(buffer);
                    API_DB.api_removeNetwork().then(() => {
                        API_DB.api_pushNetwork(data).then(() => {
                            API_DB.api_getNetwork().then((network) => {
                                console.log('Sending new network...');
                                recipient.emit(EVENT_FE.NETWORK, JSON.stringify(network));
                            });
                        });
                    });
                    try {
                        // fs.unlinkSync(NETWORK_FILE_PATH)
                        //file removed
                    } catch(err) {
                        console.error(err)
                    }
                }
            } catch (error) {
                // console.log(error); // No need to log
            }
        }, CONFIG.NETWORK_STREAMING_FREQ);
    }
}

async function _stop_network_streaming_fe(recipient=null) {
    if (null != stream_timer) {
        clearInterval(stream_timer);
        stream_timer = null;
    }
}
/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    _sendAck_fe: _sendAck_fe,
    _sendData_fe: _sendData_fe,
    _start_network_streaming_fe: _start_network_streaming_fe,
    _stop_network_streaming_fe: _stop_network_streaming_fe
}
