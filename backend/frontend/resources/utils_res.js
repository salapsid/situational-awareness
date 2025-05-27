/******************************************************
 * Contains connection related resources
 * TODO: Put all exports in API: {}
 ******************************************************/

/******************************************************
 * Map type definition
 ******************************************************/
const mapField = {
    IP: 0,
    PORT: 1,
    STATUS: 2,
    SOCKET: 3,
    DATA: 4,
    ID: 5,
};
  
/*********************************************************
 * Connection status
 * TODO: Need this in future to handle
 * disconnection/no response
 *********************************************************/
const connStatus = {
    CONNECTED: 0,
    DISCONNECTED: 1,
    CONNECTING: 2,
    UNKNOWN: 3,
};

/***********************************************************
 * The map will look like this
 * [{'socketID1', [{'status', 'connected'}, {'ip', '1.2.3.4'}]}
 * ,{'socketID2', [{'status', 'disconnected'}, {'ip', '5.6.7.8'}]}]
 ***********************************************************/
const frontendMap = new Map();
  
function updateMap(socketId, type, val) {
    if (frontendMap.has(socketId)) {
        frontendMap.get(socketId).set(type, val);
        return;
    }
    // Create a new entry in the map
    frontendMap.set(socketId, new Map());
    frontendMap.get(socketId).set(type, val);
}

function deleteFromMap(key) {
    frontendMap.delete(key);
}

function getMap() {
    return frontendMap;
}

export default {
    mapField: mapField,
    connStatus: connStatus,
    updateMap: updateMap,
    deleteFromMap: deleteFromMap,
    getMap: getMap
}