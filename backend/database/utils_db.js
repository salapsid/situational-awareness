/******************************************************
 * Contains API to interact with mongo DB
 *****************************************************/
/******************************************************
 * IMPORTS
 *****************************************************/
import mongoose from 'mongoose';
import models from './schema.js';
/******************************************************
 * STATIC VARIABLES
 *****************************************************/
const default_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
/******************************************************
 * EVENT HANDLERS
 *****************************************************/
mongoose.connection.once('open', function() {
    console.log('Connection opened');
    
});

mongoose.connection.on('error', err => {
    console.log(err);
});
mongoose.connection.on('connected', () => {
    console.log('Connection Established');
});
mongoose.connection.on('disconnected', () => {
    console.log('Connection Disconnected');
});
  
mongoose.connection.on('close', () => {
    console.log('Connection Closed');
});
/******************************************************
 * UTILITY FUNCTIONS
 *****************************************************/
async function _connect (url, user_options=default_options) {
    try {
        await mongoose.connect(url, user_options);
    } catch (err) {
        console.log(error);
    }
}

async function _disconnect() {
    await mongoose.connection.close();
}

async function _pushNetwork(collection) {
    await models.agent.insertMany(collection);
    // TODO: Implement error handlers and expose to top level API.
}

  async function _removeNetwork() {
    await models.agent.deleteMany({});
  }

async function _addAgent(agent) {
    return await models.agent.create(agent);
}

async function _deleteAgent(agent_id) {
    return await models.agent.deleteOne({ id: agent_id });
}

async function _getNetwork() {
    return await models.agent.find({});
}

async function _getAgent(agent_id) {
    return await models.agent.find({ id: agent_id}).exec();
}

async function _getAgentFields(agent_id, fields) {
    let res = await models.agent.find({ id: agent_id }, fields).exec();
    return res;
}

async function _updateAgentFields(agent_id, fields_keyval) {
    const res = await models.agent.updateMany({ id: agent_id }, fields_keyval);
    return res;
}

async function _getConnectionStatus() {
    return await mongoose.connection.readyState;
}

async function _isNetworkAvailable() {
    let res = await models.agent.exists({status: {$gte: 0}});
    return res;
}

async function _isValidAgent(agent_id) {
    return await models.agent.exists({id: agent_id});
}

async function _pushData(agent_id, data) {
    let col = await mongoose.connection.modelNames();
    if (false == col.includes(String(agent_id))) {
        models.agent_data[agent_id] = models._createPowerDataModel('agent_'+String(agent_id));
    }
    let res = await models.agent_data[agent_id].insertMany(data);
    return res;
}

async function _getAgentIdFromIpPort(ip, port) {
    // We need the following only in case of whole URI. TODO: Remove
    //const regex = /[^:]*$/;
    //const port = Number(uri.match(regex)[0]);
    //const query = '/'+String(ip)+'/i';
    const agent =  await models.agent.find({ ip: String(ip), port: Number(port)}).exec();
    if ((null != agent) || (0 != agent.length)) {
        return agent[0].id;
    }
    return null;
}
/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    _connect: _connect,
    _disconnect: _disconnect,
    _pushNetwork: _pushNetwork,
    _removeNetwork: _removeNetwork,
    _getNetwork: _getNetwork,
    _getAgent: _getAgent,
    _getAgentFields: _getAgentFields,
    _updateAgentFields: _updateAgentFields,
    _getConnectionStatus: _getConnectionStatus,
    _isNetworkAvailable: _isNetworkAvailable,
    _isValidAgent: _isValidAgent,
    _pushData: _pushData,
    _getAgentIdFromIpPort: _getAgentIdFromIpPort,
    _addAgent: _addAgent,
    _deleteAgent: _deleteAgent
  }