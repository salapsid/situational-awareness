import http from 'http'
import express from 'express'
import socketIo from 'socket.io'
//import socketIoClient from 'socket.io-client'
import getData from './agentsend/js/getData.js'
import connectionsWithAgentsAsClient from './agentsend/js/connectionsWithAgentsAsClient.js'
//import {connectWithFrontEndAsServer} from './frontend/js/connectWithFrontEndAsServer.js'
import fs from 'fs'

/* The following is needed to use __filename and __dirname in ES6 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import api_db from './api/api_database.js';
import db_cfg from './config/cfg_database.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


  
 
/* (async () => {
    // Note that await can only be used inside async
    // Thus below getData will  work  as its insie the asyn wrapper
    var data={};
    console.log("I am here")
    var data = await getData("/nodeInfo.json");
    console.log(data)
  })(); */

const app=express()
const server=http.createServer(app)
const io=socketIo(server)

//const masterNodesIo=io.of('/masterNodes')
let port=null


if (process.argv.length<=2) {
     port=3010 // default is port is 3000
} else{
   port=process.argv[2]
    
}

//app.use(express.static('../frontend/public'));
app.use(express.static('../frontend/public'));


io.on('connection', (socket)=>{
  console.log(`Connected: ${socket.id}`)
  socket.on('disconnect',()=>{
    console.log(`socket disconnected: ${socket.id}`)
  })
//connectWithFrontEndAsServer(socket)
})


/************************ */
/* Code related to agent end */
/**************************** */
let fileName="/nodeInfo.json"
let ntwrkDataFileNameWithPath=__dirname+fileName
/*  The following code will not work unless node installed is v14 or above and node is invoked as "node --experimental-top-level-await server.js". 
 top level await is being used*/
//var ntwrkData = await getData(ntwrkDataFileNameWithPath);
//connectionsWithAgentsAsClient(ntwrkData)
/* console.log(`data: ${ntwrkData}`)
console.log(ntwrkData.nodes)
const keys=Object.keys(ntwrkData)
console.log(keys)
 for(const item in ntwrkData.nodes)
{
    console.log(ntwrkData.nodes[item])
}
*/


server.listen(port,async ()=>{
    console.log(`listening on port ${port}`)
    // const buffer = fs.readFileSync('./example_networks/case5.json');
    // const data = JSON.parse(buffer);
    // await api_db.api_connect(db_cfg.url+db_cfg.proj_name)
    // await api_db.api_pushNetwork(data);
    // const nt = await api_db.api_getNetwork();
    // console.log(nt);
    // let temp = await api_db.api_getAgentFields("1", "name");
    // console
    //let nt = await api_db.api_updateAgentFields("3", {"status": 1});
    // api_db.api_disconnectMongo()
    
    
})

