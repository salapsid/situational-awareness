/******************************************************
 * IMPORTS
 *****************************************************/
import {EVENT_AG, ACK_CODE} from './events.js';
import CONFIG from '../../config/cfg_backend.js';
import API_DB from '../../api/api_database.js';
import UTIL_RES from '../resources/utils_res.js';
import API_ROUTER from '../../api/api_router.js';
import fs from 'fs';
/******************************************************
 * STATIC VARIABLES
 *****************************************************/
const LOG_PREFIX = 'event_handler: ';
const ENABLE_VERBOSE = true;
const NUM_SAMPLE_TO_STORE = 3000;
const FILE_PATH_VM = './algorithms/static_network_reconstruction/dataset/datasetVM.txt';
const FILE_PATH_VM_TEMP = './algorithms/static_network_reconstruction/dataset/datasetVM_temp.txt';
const FILE_PATH_VA = './algorithms/static_network_reconstruction/dataset/datasetVA.txt';
const FILE_PATH_VA_TEMP = './algorithms/static_network_reconstruction/dataset/datasetVA_temp.txt';
const FILE_PATH_P = './algorithms/static_network_reconstruction/dataset/datasetP.txt';
const FILE_PATH_P_TEMP = './algorithms/static_network_reconstruction/dataset/datasetP_temp.txt';
const FILE_PATH_Q = './algorithms/static_network_reconstruction/dataset/datasetQ.txt';
const FILE_PATH_Q_TEMP = './algorithms/static_network_reconstruction/dataset/datasetQ_temp.txt';
let sample_count = 0;
const bus_set = new Set();
let curr_timstamp = null;
let writeStreamVM = fs.createWriteStream(FILE_PATH_VM);
let writeStreamVA = fs.createWriteStream(FILE_PATH_VA);
let writeStreamP = fs.createWriteStream(FILE_PATH_P);
let writeStreamQ = fs.createWriteStream(FILE_PATH_Q);
let arrayVM = [];
let arrayVA = [];
let arrayP = [];
let arrayQ = [];
/******************************************************
 * EVENT HANDLER
 *****************************************************/
function registerHandler_ag (socket) {
    socket.on(EVENT_AG.CONNECTION, () => {
        if (true == ENABLE_VERBOSE) {
            console.log(LOG_PREFIX+'Connected with agent ID = ', socket.id);
        }
        // Update the agent connection map
        let ip = null;
        let port = null;
        if ((socket.hasOwnProperty('io')) && (socket.io.hasOwnProperty('engine')) &&
        (socket.io.engine.hasOwnProperty('hostname')) && (socket.io.engine.hasOwnProperty('port'))) {
            ip = socket.io.engine.hostname;
            port = socket.io.engine.port;
        } else {
            console.log(LOG_PREFIX+'Connection socket property mismatch error!'+
            'Database will not be updated!');
        }
        if ((null != ip) && (null != port)) {
            // Construct the key for local map
            const key = String(ip)+String(port);
            const connStatus = UTIL_RES.connStatus.CONNECTED;
            const statusField = UTIL_RES.mapField.STATUS;
            const ipField = UTIL_RES.mapField.IP;
            const socketField = UTIL_RES.mapField.SOCKET;
            UTIL_RES.updateMap(key, statusField, connStatus);
            UTIL_RES.updateMap(key, ipField, socket.io.uri);
            UTIL_RES.updateMap(key, socketField, socket);
        } else {
            console.log(LOG_PREFIX+'Agent socket object has no proper ip and port number!');
        }
        if (false == CONFIG.IS_FRONTEND_ENABLED) {
            socket.emit(EVENT_AG.START);
        }
    });
    // Register disconnection handler: For client side we need to do it outside on.connection()
    socket.on(EVENT_AG.DISCONNECTION, async (reason)=> {
        // Get IP and PORT from socket ID
        let ip = null;
        let port = null;
        if ((socket.hasOwnProperty('io')) && (socket.io.hasOwnProperty('engine')) &&
        (socket.io.engine.hasOwnProperty('hostname')) && (socket.io.engine.hasOwnProperty('port'))) {
            ip = socket.io.engine.hostname;
            port = socket.io.engine.port;
        } else {
            console.log(LOG_PREFIX+'Disconnection socket property mismatch error!'+
            'Database will not be updated!');
        }
        if ((null != ip) && (null != port)) {
            // Now we need to map IP PORT to agent ID from database
            let id = await API_DB.api_getAgentIdFromIpPort(ip, port);
            if (null != id) {
                console.log(LOG_PREFIX+'Disconnected from agent '+id);
                await API_DB.api_updateAgentFields(id, {status: 0});
                API_ROUTER.api_sendStatus_ag_to_fe({id: id, status: 0});
            } else {
                console.log(LOG_PREFIX+'Database could not find valid agent which disconnected');
            }
            const key = String(ip)+String(port);
            UTIL_RES.deleteFromMap(key);
        }
        //socket.removeAllListeners();
    });

    socket.on(EVENT_AG.DATA, async (data) => {
        let json_data = JSON.parse(data);
        // console.log(json_data);
        // console.log('message from ', json_data.id);
        // Check if agent is valid
        let is_valid = await API_DB.api_isValidAgent(json_data.id)
        // console.log(json_data.timestamp);
        if (true == is_valid) {
            await API_DB.api_pushData(json_data.id, json_data);
            // First thing to check if currrent timestamp is null
            // this means we are receiving the first packet from some agent
            let ts = Number(json_data.timestamp).toFixed(2);
            console.log('id = ', json_data.id, ' time = ', ts);
            if (null == curr_timstamp) {
                curr_timstamp = ts;
                [...Array(33).keys()].forEach(item => bus_set.add(item));
                // console.log(bus_set);
            }
            // Now check if this agent has already sent data with same timestamp
            // we expect to receive data from all nodes for a single timstamp
            if (bus_set.has(Number(json_data.id)-1)) {
                // Are we receiving data for current timestamp?
                if (ts == curr_timstamp) {
                    // Write to file
                    // console.log('got data from ', json_data.id);
                    arrayVM.push(json_data.id);
                    arrayVM.push(json_data.v_mag);
                    arrayVA.push(json_data.id);
                    arrayVA.push(json_data.v_ang);
                    arrayP.push(json_data.id);
                    arrayP.push(json_data.load_bus.pd);
                    arrayQ.push(json_data.id);
                    arrayQ.push(json_data.load_bus.qd);
                    // Delete so that it will not get recorded again
                    bus_set.delete(Number(json_data.id)-1);
                    // Check if this is the last data we expect for this timestamp
                    if (bus_set.size == 0) {
                        // Write to file streams
                        writeStreamVM.write(arrayVM.toString());
                        writeStreamVM.write('\n');
                        writeStreamVA.write(arrayVA.toString());
                        writeStreamVA.write('\n');
                        writeStreamP.write(arrayP.toString());
                        writeStreamP.write('\n');
                        writeStreamQ.write(arrayQ.toString());
                        writeStreamQ.write('\n');
                        arrayVM = [];
                        arrayVA = [];
                        arrayP = [];
                        arrayQ = [];
                        // Reset current timestamp
                        curr_timstamp = null;
                        // Increase sample count by 1
                        sample_count = sample_count + 1;
                        console.log('writing sample ', sample_count);
                        // Is this the last sample before we store in textfile?
                        if (NUM_SAMPLE_TO_STORE == sample_count) {
                            // Close file stream
                            writeStreamVM.end();
                            writeStreamVA.end();
                            writeStreamP.end();
                            writeStreamQ.end();
                            sample_count = 0;
                            console.log('writing...');
                            writeStreamVM = fs.createWriteStream(FILE_PATH_VM_TEMP);
                            writeStreamVA = fs.createWriteStream(FILE_PATH_VA_TEMP);
                            writeStreamP = fs.createWriteStream(FILE_PATH_P_TEMP);
                            writeStreamQ = fs.createWriteStream(FILE_PATH_Q_TEMP);
                        }
                    }
                } else {
                    // it seems somebody is not in sync
                    // for now simply drop. TODO: Handle it later
                    console.log('Dropping...');
                    curr_timstamp = null;
                    arrayVM = [];
                    arrayVA = [];
                    arrayP = [];
                    arrayQ = [];
                }
            }
        }
        if (true == CONFIG.IS_AUTO_SEND_TO_FRONT_ENABLED) {
            API_ROUTER.api_sendData_ag_to_fe(data);
        }
    });

    socket.on(EVENT_AG.STATUS_CHANGE, async (data) => {
        console.log(data);
        if ((true == data.hasOwnProperty('id')) && (true == data.hasOwnProperty('status'))) {
            let is_valid = await API_DB.api_isValidAgent(data.id)
            if (true == is_valid) {
                await API_DB.api_updateAgentFields(data.id, {status: data.status});
                API_ROUTER.api_sendStatus_ag_to_fe(data);
            }
        }
    });
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    registerHandler_ag: registerHandler_ag
}