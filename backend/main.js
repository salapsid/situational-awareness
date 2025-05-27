/******************************************************
 * Contains backend configuration
 *****************************************************/
import http from 'http';
import express from 'express';
import {Server as socketIo} from 'socket.io';
import socketIoClient from 'socket.io-client';
import CONFIG from './config/cfg_backend.js';
import agEventHandler from './agentsEnd/connection/event_handler.js';
import feEventHandler from './frontend/connection/event_handler.js';
import api_db from './api/api_database.js';
import CONFIG_DB from './config/cfg_database.js';
import fs from 'fs';
import cors from 'cors';
/******************************************************
 * STATIC VARIABLES: GNERAL
 *****************************************************/
const ENABLE_VERBOSE = true;
const LOG_PREFIX = "main: ";
/******************************************************
 * STATIC VARIABLES: FRONTEND 
 *****************************************************/
const app_fe=express();
const server_fe=http.createServer(app_fe);
const io_fe=new socketIo(server_fe, cors());
const io_fe_namespace=io_fe.of(CONFIG.FRONTEND_NAMESPACE);
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
    [id = "backend", ip = "localhost", port = "8080", ...redundant] = process.argv.slice(2);
    // TODO: Validate argument type
    return {
        own_id: id,
        own_ip: ip,
        own_port: port,
        rest: redundant,
    };
}

/******************************************************
 * Contains backend configuration
 *****************************************************/
async function connectToAgents(network) {
    for (let ag_idx in network) {
        let url = 'http://' + network[ag_idx].ip + ':' + network[ag_idx].port + '/' + CONFIG.AGENT_NAMESPACE;
        let agent_socket = await socketIoClient(url);
        agEventHandler.registerHandler_ag(agent_socket);
    }
  }


async function init_agent_end() {
    try {
      // Check if mongoDB connection exists
      if (0 == await api_db.api_getConnectionStatus()) {
          if (true == ENABLE_VERBOSE) {
              console.log("Connecting to mongo...");
          }
          await api_db.api_connect(CONFIG_DB.url+CONFIG_DB.proj_name);
          // TODO: Handle connection event here
          if (true == CONFIG_DB.IS_ALWAYS_PUSH_NETWORK_ENABLED) {
                // Check if network exists. If so, delete it.
                if(true == await api_db.api_isNetworkAvailable()) {
                    await api_db.api_removeNetwork();
                }
          }
          if (false == await api_db.api_isNetworkAvailable()) {
                // Push network
                const buffer = fs.readFileSync(CONFIG.EXAMPLE_NETWORK);
                const data = JSON.parse(buffer);
                if (true == ENABLE_VERBOSE) {
                    console.log("Pushing network...");
                }
                await api_db.api_pushNetwork(data);
          }
          // Get network and connect to all the agents present
          let network = await api_db.api_getNetwork();
          // Connect to agents
          await connectToAgents(network);
      }
    } catch (err) {
      console.log(err);
    }
}

function init_front_end() {
    // Parse command line arguments
    const args = parseArguments();
    own_id = Number(args.own_id);
    own_ip = String(args.own_ip);
    own_port = Number(args.own_port);
    app_fe.use(express.static(CONFIG.FRONTEND_STATIC_FILE_LOCATION));
    feEventHandler.register_handler_fe(io_fe_namespace);
    server_fe.listen(own_port,async ()=>{
        console.log(`listening for frontend on port ${own_port}`);
    });
}
/******************************************************
 * CODE STARTS HERE
 *****************************************************/
if (true == CONFIG.IS_AGENT_ENABLED){
    init_agent_end();
}
if (true == CONFIG.IS_FRONTEND_ENABLED) {
    init_front_end();
}
