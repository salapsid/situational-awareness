/******************************************************
 * Contains config and constants for database
 * schema validation
 * FOR INTERNAL USE ONLY
 *****************************************************/
import mongoose from 'mongoose'

const ERR_MSG = {
    ID: 'ERR: Please provide ID',
    SECURE_KEY: 'ERR: Please provide password',
    IP: 'ERR: Please provide IP address',
    PORT_MIN: 'Please use a registered port between 1024-65535',
    PORT_MAX: 'Please use a registered port between 1024-65535',
    PORT: 'ERR: Please provide port number',
    TIMESTAMP: 'ERR: No timestamp found'
};

const USE_CASE = {
    GENERAL_NETWORK: 1,
    CONSENSUS: 2,
    POWER_NETWORK: 3,
    RFU: 4
};

const CONSENSUS_TYPE = {
    HOST: 0,
    CLIENT: 1,
    RFU: 2,
};

const POWER_NETWORK_TYPE = {
    SLACK_BUS: 0,
    PQ_BUS: 1,
    PV_BUS: 2
};

const to_from_schema = new mongoose.Schema({
    id: { type: String },
    ip: { type: String },
    port: Number,
    access_code: String,
    signature: String,
    status: Boolean,
    link_weight: String
});

/**********************************************
 * Not enforcing this yet.
 * TODO: Should we enforce this? Can affect
 * throughput?
 *********************************************/
const power_data_schema = new mongoose.Schema({
    id: {type: String},
    timestamp: {type: Number, required: [true, ERR_MSG.TIMESTAMP]},
    version: {type: String},
    unit: {type: String},
    ang_unit: {type: String},
    base_mva: Number,
    base_kv: Number,
    gen_bus:{
        is_gen_bus: Boolean,
        status: Boolean,
        pg: Number,
        qg: Number,
        max_pg: Number,
        min_pg: Number,
        max_qg: Number,
        min_qg: Number,
        vg: Number,
        mbase: Number
    },
    load_bus:{
        is_load_bus: Boolean,
        status: Boolean,
        pd: Number, // Changing only this foe demo purpose
        qd: Number
    },
    v_mag: Number,
    v_ang: Number,
    i_mag: Number
});

const agent_network_schema = new mongoose.Schema({
    type: { type: Number },
    to: [to_from_schema],
    from: [to_from_schema],
    own: {
        weight: Number
    }
});

const agent_schema = new mongoose.Schema({
    id: { type: String, required: [true, ERR_MSG.ID]}, // TODO: Add custom validator
    secure_key: { type: String, required: [true, ERR_MSG.SECURE_KEY]}, // TODO: Add custom validator 
    ip: { type: String, required: [true, ERR_MSG.IP]},
    port: { type: Number,
        min: [1024, ERR_MSG.PORT_MIN],
        max: [65535, ERR_MSG.PORT_MAX],
        required: [true, ERR_MSG.PORT]},
    type: { type: String },
    status: { type: Boolean },
    name: String,
    profile_img: String,
    network: agent_network_schema,
    data: {}
});

const agent = mongoose.model('network', agent_schema);
let agent_data = {};

function _createPowerDataModel(name) {
    return mongoose.model(name, power_data_schema);
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    agent: agent,
    agent_data: agent_data,
    _createPowerDataModel: _createPowerDataModel
}