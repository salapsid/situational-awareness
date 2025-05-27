/******************************************************
 * Contains backend configuration
 *****************************************************/
export default {
    AGENT_NAMESPACE: "agent_namespace",
    IS_EXPERIMENTAL: true,
    IS_EXP_SYSTEM_PRESENT: false,//false
    EXP_SYSTEM_PROTOCOL: "UDP",
    SYSTEM_MULTICAST_IP: "224.0.0.114",
    SYSTEM_SOCKET_PORT: 5556,
    SYSTEM_LOCAL_PORT: 5556,
    EXP_STREAM_FREQ: 100, // in ms
    IS_LOCALHOST: true // make this false to open server on local ip instead of localhost
} 