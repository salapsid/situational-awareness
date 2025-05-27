/******************************************************
 * Contains backend configuration
 *****************************************************/
export default {
    IS_AGENT_ENABLED: true,
    IS_FRONTEND_ENABLED: true,
    IS_AUTO_SEND_TO_FRONT_ENABLED: true,
    IS_NETWORK_AUTO_SEND_TO_FRONT_ENABLED: true,
    NETWORK_STREAMING_FREQ: 4000,  //ms
    AGENT_NAMESPACE: "agent_namespace",
    FRONTEND_NAMESPACE: "frontend_namespace",
    FRONTEND_STATIC_FILE_LOCATION: "../frontend/public",
    EXAMPLE_NETWORK: "./example_networks/case33bw_mod.json"
}