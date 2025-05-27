//////////////////////////////////
import udp from 'dgram';
//////////////////////////////////
const PORT = 5555;
const IP = "128.101.167.74" // Change
const BROADCAST_IP = "255.255.255.255"
const BROADCAST_PORT = 5556;
// Create UDP socket
const udp_sock = udp.createSocket({
    type: "udp4",
    reuseAddr: true
});
// Error check in socket creation
udp_sock.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    udp_sock.close();
});
// Message receiver from OPAL-RT
udp_sock.on('message', (msg, rinfo) => {
    console.log(`server got message from ${rinfo.address}:${rinfo.port}`);
    const message = Buffer.from(msg);
    udp_sock.send(message, BROADCAST_PORT, BROADCAST_IP);
});
// UDP listener: JUST ONCE
udp_sock.on('listening', () => {
    const address = udp_sock.address();
    // udp_sock.setRecvBufferSize(1000);
    console.log(`UDP listening to ${address.address}:${address.port}`);
});
// BIND: JUST ONCE
udp_sock.bind(PORT, IP, () => {
    udp_sock.setBroadcast(true);
    // udp_sock.addMembership(CONFIG.SYSTEM_MULTICAST_IP);
});

