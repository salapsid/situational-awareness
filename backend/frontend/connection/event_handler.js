/******************************************************
 * IMPORTS
 *****************************************************/
import {EVENT_FE, ACK_CODE} from './events.js';
import API_ROUTER from '../../api/api_router.js';
import API_DB from '../../api/api_database.js';
import { EVENT_AG } from '../../agentsEnd/connection/events.js';
import UTIL_RES from '../resources/utils_res.js';
import CONFIG_FE from '../../config/cfg_backend.js';
import API_CONN_FE from '../../api/api_connection_fe.js';
/******************************************************
 * STATIC VARIABLES
 *****************************************************/
const LOG_PREFIX = 'B2F event_handler: ';
const ENABLE_VERBOSE = true;
/******************************************************
 * EVENT HANDLER
 *****************************************************/
function register_handler_fe (nsp_frontend) {
    nsp_frontend.on(EVENT_FE.CONNECTION, (socket) => {
        if (true == ENABLE_VERBOSE) {
            console.log(LOG_PREFIX+'Connected with frontend ID = ', socket.id);
        }
        // Register disconnection handler once connected
        socket.on(EVENT_FE.DISCONNECTION, (reason)=> {
            console.log(LOG_PREFIX+'Disconnected from frontend');
            UTIL_RES.deleteFromMap(socket.id);
            socket.removeAllListeners();
            if (true == CONFIG_FE.IS_NETWORK_AUTO_SEND_TO_FRONT_ENABLED) {
                API_CONN_FE.api_stop_network_streaming_fe();
            }
        });
        // Update the frontend connection map
        const key = socket.id;
        const connStatus = UTIL_RES.connStatus.CONNECTED;
        const statusField = UTIL_RES.mapField.STATUS;
        //const ipField = UTIL_RES.mapField.IP;
        const socketField = UTIL_RES.mapField.SOCKET;
        UTIL_RES.updateMap(key, statusField, connStatus);
        //UTIL_RES.updateMap(key, ipField, socket.io.uri);
        UTIL_RES.updateMap(key, socketField, socket);
        // Start listening for start event
        socket.on(EVENT_FE.INIT, (init_data) => {
            if (null == init_data) {
                if (true == ENABLE_VERBOSE) {
                    console.log(LOG_PREFIX+'No init data');
                }
            }
            // Initialization means sending the whole network
            if (true == CONFIG_FE.IS_NETWORK_AUTO_SEND_TO_FRONT_ENABLED) {
                API_CONN_FE.api_start_network_streaming_fe(socket);
            } else {
                API_DB.api_getNetwork().then((network) => {
                    socket.emit(EVENT_FE.NETWORK, JSON.stringify(network));
                });
            }
        });
        // Start listening for start event
        socket.on(EVENT_FE.START, (data)=> {
            // If data is null, we send start event to all agents
            if (null == data) {
                let broadcast_data = {event: EVENT_AG.START};
                API_ROUTER.api_sendEvent(broadcast_data);
            } else {
                let event_field = {event: EVENT_AG.START};
                let extended_data = {...event_field, ...data};
                API_ROUTER.api_sendEvent(extended_data);
            }
        });
        // Start listening for stop event
        socket.on(EVENT_FE.STOP, (data) => {
            // Currently we will send stop event to all agents
            if (null == data) {
                let broadcast_data = {event: EVENT_AG.STOP};
                API_ROUTER.api_sendEvent(broadcast_data);
            } else {
                let event_field = {event: EVENT_AG.STOP};
                let extended_data = {...event_field, ...data};
                API_ROUTER.api_sendEvent(extended_data);
            }
        });

        //Start Listening for sampling_period being sent
        socket.on(EVENT_FE.SAMPLING_PERIOD, (data) => {
            if(data){
                let event_field = {event: EVENT_AG.SAMPLING_PERIOD};
                let extended_data = {...event_field, ...data};
                console.log(`extEvenData:${extended_data}`)
                API_ROUTER.api_sendEvent(extended_data);
            }
        });

        socket.on(EVENT_FE.ROUTE, (data) => {
            API_ROUTER.api_sendEvent(data);
        });
        // Stop network update from backend. Backend will not send networks
        // automatically
        socket.on(EVENT_FE.STOP_NETWORK_UPDATE, (data) => {
            if (true == CONFIG_FE.IS_NETWORK_AUTO_SEND_TO_FRONT_ENABLED) {
                API_CONN_FE.api_stop_network_streaming_fe();
            }
        });
    });   
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    register_handler_fe: register_handler_fe
}