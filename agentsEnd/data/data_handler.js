/******************************************************
 * IMPORTS
 *****************************************************/
import CONFIG from '../config/cfg_agent.js';
import API_DATA from '../api/api_data.js';
/******************************************************
 * FUNCTION DEFINITIONS
 *****************************************************/
function getExperimentalData(pd, qd=0, v_mag=1, v_ang=0, timestamp=null) {
    let time_stamp = 0;
    if (null == timestamp) {
        time_stamp = new Date().getTime();
    } else {
        time_stamp = timestamp;
    }
    let id = API_DATA.api_getOwnId();
    let data = {
        "timestamp": time_stamp,
        "id": id,
        "version":"2", 
        "unit":"pu", 
        "ang_unit":"rad", 
        "base_mva":100, 
        "base_kv":135, 
        "gen_bus":{
            "is_gen_bus":1, 
            "status":1, 
            "pg":23.54, 
            "qg":0, 
            "max_pg":80, 
            "min_pg":0, 
            "max_qg":150, 
            "min_qg":-20, 
            "vg":1, 
            "mbase":100
        }, 
        "load_bus":{
            "is_load_bus":1, 
            "status":1, 
            "pd":pd, // Changing only this foe demo purpose
            "qd":qd
        }, 
        "v_mag":v_mag, 
        "v_ang":v_ang
    }
    return JSON.stringify(data);
}

/******************************************************
 * MODULE EXPORTS
 *****************************************************/
export default {
    getExperimentalData: getExperimentalData
}