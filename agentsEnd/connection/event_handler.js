/******************************************************
 * IMPORTS
 *****************************************************/
import {EVENT_FE, ACK_CODE} from './events.js';
import api_conn from '../api/api_connection.js';
import API_DATA from '../api/api_data.js';

/******************************************************
 * STATIC VARIABLES
 *****************************************************/
const LOG_NAME = 'event_handler: ';
const ENABLE_VERBOSE = true;
/******************************************************
 * EVENT HANDLER
 *****************************************************/
function register_handler_fe (nsp_frontend) {
    nsp_frontend.on(EVENT_FE.CONNECTION, (socket) => {
        if (true == ENABLE_VERBOSE) {
            console.log(LOG_NAME+'Connected with frontend ID = ', socket.id);
            api_conn.api_sendStatus_fe(socket, {id: API_DATA.api_getOwnId(), status: 1});
        }
        // Register disconnection handler once connected
        socket.on(EVENT_FE.DISCONNECTION, (reason)=> {
            console.log('Disconnected from frontend');
            socket.removeAllListeners();
        });
        // Start listening for start event
        socket.on(EVENT_FE.INIT, (init_data) => {
            if (null == init_data) {
                if (true == ENABLE_VERBOSE) {
                    console.log(LOG_NAME+'No init data');
                }
            }
            // TODO: Add general init code
            api_conn.api_sendAck_fe(socket, ACK_CODE.INIT);
        });
        // Start listening for start event
        socket.on(EVENT_FE.START, ()=> {
            api_conn.api_start_streaming_fe(socket);
        });
        // Start listening for stop event
        socket.on(EVENT_FE.STOP, (socket) => {
            api_conn.api_stop_streaming_fe(socket);
        })

        //start listening for sampling_Period
        socket.on(EVENT_FE.SAMPLING_PERIOD, (data) => {
            console.log("Inside")
           // data=JSON.parse(data)
            if (data.hasOwnProperty('samplingPeriod')){
                api_conn.api_stop_streaming_fe(null)
                //console.log(`printingSampPer:${data.samplingPeriod}`)
              API_DATA.api_updateOwnSamplingPeriod(data.samplingPeriod)
                console.log(`Api_data: ${API_DATA.api_getOwnSamplingPeriod()}`)
                //api_conn.api_start_streaming_fe(socket);
            }
           console.log(`data:${data}`)
        })
    });   
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    register_handler_fe: register_handler_fe
}