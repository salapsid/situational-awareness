import socketIoClient from 'socket.io-client'

function registerClient(client, data) {
    client.on('connect',()=>{
        console.log(`Connected as Client with id ${client.id}`)
    })
    client.on('dataFromAgent',(data)=>{
       console.log(`Data has arrived from server with id ${client.id}`)
      console.log(data)
    })
    client.emit('initialize',data)
    client.emit('start',{})
    
}

async function connectionsWithAgentsAsClient(jsonFile) {
    /* jsonFile needs to be a json file with two objects; selfType and nodes. The nodes key has a value which is an array of objects. Each of these objects in the array should have three keys, "ip","port" and "data"
*/
    let selfType = jsonFile.selfType;
    for (let item in jsonFile.nodes) {
      let url = 'http://' + jsonFile.nodes[item].ip + ':' + jsonFile.nodes[item].port + '/masterNodes';
      console.log(url);
      let clientSocket= socketIoClient(url);
      registerClient(clientSocket, jsonFile.nodes[item].data);
    }
  }
  
  export default connectionsWithAgentsAsClient