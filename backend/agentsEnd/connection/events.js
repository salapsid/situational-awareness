/******************************************************
 * Contains backend configuration
 *****************************************************/
const EVENT_AG = {
    CONNECTION: "connect",
    DISCONNECTION: "disconnect",
    INIT: "initialize",
    START: "start",
    STOP: "stop",
    ERROR: "error",
    DATA: "data",
    STATUS_CHANGE: "status_change",
    ALERT: "alert",
    UPDATE_REQ: "update_request",
    ACK: "ack",
    SAMPLING_PERIOD:"sampling_period"
};

const ACK_CODE = {
CONNECTION: 0,
INIT: 1,
START: 2,
STOP: 3
};
export {EVENT_AG, ACK_CODE};