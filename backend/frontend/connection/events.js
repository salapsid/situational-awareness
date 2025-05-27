/******************************************************
 * Contains backend configuration
 *****************************************************/
const EVENT_FE = {
    // Connection events
    CONNECTION: "connection",
    DISCONNECTION: "disconnect",
    // Incoming events: Expect frontend to send these
    INIT: "initialize",
    START: "start",
    STOP: "stop",
    ROUTE: "route",
    SAMPLING_PERIOD: "sampling_period",
    STOP_NETWORK_UPDATE: "stop_network_update",
    // Outgoing events: Expect frontend to receive these
    NETWORK: "network",
    DATA: "data",
    STATUS_CHANGE: "status_change",
    // Bidirectional events
    ALERT: "alert",
    ERROR: "error",
    UPDATE_REQ: "update_request",
    ACK: "ack"
};

const ACK_CODE = {
CONNECTION: 0,
INIT: 1,
START: 2,
STOP: 3
};
export {EVENT_FE, ACK_CODE};