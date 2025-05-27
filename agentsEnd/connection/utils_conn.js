/******************************************************
 * IMPORTS
 *****************************************************/
import {EVENT_FE} from './events.js';
import data_handler from '../data/data_handler.js';
import data_buffer from '../data/data_buffer.js';
import CONFIG from '../config/cfg_agent.js'
import API_DATA from '../api/api_data.js';
import zmq from "zeromq";
import udp from 'dgram';
import CircularBuffer from 'circular-buffer';
/******************************************************
 * STATIC VARIABLES
 *****************************************************/
let stream_timer = null;
let zmq_sock = null;
let udp_sock = null;
let buf = new CircularBuffer(10);
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

async function _sendStatus_fe(recipient, data) {
    if (null != recipient) {
        recipient.emit(EVENT_FE.STATUS_CHANGE, data);
    }
}

async function _start_exp_streaming_fe(recipient) {
    if (null == stream_timer) {
        console.log(data_buffer._getOwnSamplingPeriod())
        stream_timer = setInterval(() => {
            let random_data  = data_handler.getExperimentalData(Math.random());
            recipient.emit(EVENT_FE.DATA, random_data);
        }, data_buffer._getOwnSamplingPeriod());
    }
}

async function _stop_exp_streaming_fe(recipient) {
    if (null != stream_timer) {
        clearInterval(stream_timer);
        stream_timer = null;
    }
}

async function _emulate_sensor(recipient) {
    if ("ZMQ" === CONFIG.EXP_SYSTEM_PROTOCOL) {
        if (null == zmq_sock) {
            zmq_sock = new zmq.Subscriber();
            zmq_sock.connect('tcp://' + CONFIG.SYSTEM_SOCKET_IP + ':' + String(CONFIG.SYSTEM_SOCKET_PORT));
            console.log(String((API_DATA.api_getOwnId())));
            zmq_sock.subscribe(String(API_DATA.api_getOwnId()));
        
        for await (let data of zmq_sock) {
            data = data.toString().slice(String((API_DATA.api_getOwnId())).length+1);
            data = JSON.parse(data);
            //console.log("received a message: ", data);
            let system_data  = data_handler.getExperimentalData(data.pd, data.qd, data.v_mag, data.v_ang, data.timestamp);
            recipient.emit(EVENT_FE.DATA, system_data);
        }}
    } else if ("UDP" === CONFIG.EXP_SYSTEM_PROTOCOL) {
        if (null == udp_sock) {
            udp_sock = udp.createSocket({
                type: "udp4",
                reuseAddr: true
            });
            udp_sock.on('error', (err) => {
                console.log(`server error:\n${err.stack}`);
                udp_sock.close();
              });
              
              udp_sock.on('message', (msg, rinfo) => {
                console.log(`server got message from ${rinfo.address}:${rinfo.port}`);
                let timestamp = 0;
                let v = 0;
                let theta = 0;
                let p = 0;
                let q = 0;
                let values = [];
                let id = Number(API_DATA.api_getOwnId());
                timestamp = msg.readFloatLE(0);
                v = msg.readFloatLE(id*4);
                theta = msg.readFloatLE((id+33)*4);
                p = msg.readFloatLE((id+33*2)*4);
                q = msg.readFloatLE((id+33*3)*4);
                values.push(timestamp);
                values.push(v);
                values.push(theta);
                values.push(p);
                values.push(q);
                buf.enq(values);
              });
              
              udp_sock.on('listening', () => {
                const address = udp_sock.address();
                // udp_sock.setRecvBufferSize(1000);
                console.log(`UDP listening to ${address.address}:${address.port}`);
                // Now add timer to upload data to backend
                if (null == stream_timer) {
                    stream_timer = setInterval(() => {
                        try {
                            // console.log('about to send ');
                            let values = buf.deq();
                            let timestamp = values[0];
                            let v = values[1];
                            let theta = values[2];
                            let p = values[3];
                            let q = values[4];
                            console.log(theta);
                            let random_data  = data_handler.getExperimentalData(p, q, v, theta, timestamp);
                            recipient.emit(EVENT_FE.DATA, random_data);
                        } catch (error) {
                            // console.log(error); // No need to log
                        }
                    }, CONFIG.EXP_STREAM_FREQ);
                }
              });
              
              udp_sock.bind(CONFIG.SYSTEM_SOCKET_PORT, () => {
                udp_sock.setBroadcast(true);
                // udp_sock.addMembership(CONFIG.SYSTEM_MULTICAST_IP);
              });
        }
    }
    
}
/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    _sendAck_fe: _sendAck_fe,
    _sendData_fe: _sendData_fe,
    _start_exp_streaming_fe:_start_exp_streaming_fe,
    _stop_exp_streaming_fe: _stop_exp_streaming_fe,
    _sendStatus_fe: _sendStatus_fe,
    _emulate_sensor: _emulate_sensor
}
