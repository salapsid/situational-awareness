import http from 'http';
import express from 'express';
import {Server as socketIo} from 'socket.io';
import event_handler from './connection/event_handler.js';
import CONFIG from './config/cfg_agent.js';
import API_DATA from './api/api_data.js';
import IP_MODULE from 'ip';

const app=express()
const server=http.createServer(app)
const io=new socketIo(server)
/* each agent creates a server port with a roomName masterNodes. The  nodes at the backend server providing services to all agents will be a client for each agent server accessing the room with name masterNodes
*/
const masterNodesIo=io.of(CONFIG.AGENT_NAMESPACE)
let own_id = null;
let own_ip = null;
let own_port = null;
/**********************************************************
 * Parse CLI arguments
 **********************************************************/
function parseArguments() {
    // Custom user arguments starts from process.argv[2] //
    let id = null;
    let ip = null;
    let port = null;
    let redundant = null;
    if (process.argv.length <= 2) {
      console.log('Not enough arguments, setting to default...');
    }
    [id = "1", ip = "localhost", port = "3000", ...redundant] = process.argv.slice(2);
    // TODO: Validate argument type
    if (false == CONFIG.IS_LOCALHOST) {
        if (ip === 'localhost') {
            ip = IP_MODULE.address();
            console.log('overriding ip to ', ip);
        }
    } else {
        ip = 'localhost';
    }
    return {
        own_id: id,
        own_ip: ip,
        own_port: port,
        rest: redundant,
    };
}
// Parse command line arguments
const args = parseArguments();
own_id = Number(args.own_id);
own_ip = String(args.own_ip);
own_port = Number(args.own_port);
API_DATA.api_updateOwnId(own_id);
API_DATA.api_updateOwnIp(own_ip);
API_DATA.api_updateOwnPort(own_port);

// masterNodesIo.on('connection', (socket)=>{
//     console.log(`a user with id ${socket.id} has connected as a client`);
//     socket.on('disconnect',()=>{
//         console.log(`Client with id ${socket.id} has disconnected`);
//     })
//     let dataObj={"name":"Murti", "port":port}
//     /* sending a json object */
//     socket.emit(`dataFromAgent`,dataObj)

//     /* placeholder for initialize command being received by agent */
//     socket.on('initialize',(data)=>{
//         console.log(`initialize command received`)
//         console.log(data)
//     })
//      /* placeholder for start command being received by agent */
//      socket.on('start',()=>{
//         console.log(`Start command received`)
//     })
//     socket.on('stop',()=>{
//         console.log(`Stop command received`)
//     })
//   });

event_handler.register_handler_fe(masterNodesIo);
server.listen(own_port, own_ip, ()=>{
    console.log(`listening on port ${own_port}`)
})

