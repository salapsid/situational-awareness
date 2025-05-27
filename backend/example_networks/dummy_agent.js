//////////////////////////////////
import udp from 'dgram';
import CircularBuffer from 'circular-buffer';
import fs from 'fs';
import child_process from 'child_process';
//////////////////////////////////
const PORT = 5556;
const IP = "128.101.167.74" // Change
const BROADCAST_IP = "255.255.255.255"
const BROADCAST_PORT = 5556;
const SAMPLE_TIME = 100;
/*******************************************************
 * File location and constants
 ******************************************************/
const NUM_SAMPLE_TO_STORE = 30;
const FILE_PATH_VM = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetVM.txt';
const FILE_PATH_VM_TEMP = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetVM_temp.txt';
const FILE_PATH_VA = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetVA.txt';
const FILE_PATH_VA_TEMP = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetVA_temp.txt';
const FILE_PATH_P = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetP.txt';
const FILE_PATH_P_TEMP = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetP_temp.txt';
const FILE_PATH_Q = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetQ.txt';
const FILE_PATH_Q_TEMP = 'C:/Users/chakr138/Aelios/situationalAwareness/dataset/datasetQ_temp.txt';
let sample_count = 0;
const bus_set = new Set();
let curr_timstamp = null;
let writeStreamVM = fs.createWriteStream(FILE_PATH_VM);
let writeStreamVA = fs.createWriteStream(FILE_PATH_VA);
let writeStreamP = fs.createWriteStream(FILE_PATH_P);
let writeStreamQ = fs.createWriteStream(FILE_PATH_Q);
let arrayVM = [];
let arrayVA = [];
let arrayP = [];
let arrayQ = [];
let is_called_once = false;
/*******************************************************
 * Variables
 ******************************************************/
let buf = new CircularBuffer(10);
let stream_timer = null;
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
    // console.log(`server got message from ${rinfo.address}:${rinfo.port}`);
    buf.enq(msg);
    // const message = Buffer.from(msg);
    // udp_sock.send(message, BROADCAST_PORT, BROADCAST_IP);
});
// UDP listener: JUST ONCE
udp_sock.on('listening', () => {
    const address = udp_sock.address();
    // udp_sock.setRecvBufferSize(1000);
    console.log(`UDP listening to ${address.address}:${address.port}`);
});
// BIND: JUST ONCE
udp_sock.bind(PORT, () => {
    udp_sock.setBroadcast(true);
    // udp_sock.addMembership(CONFIG.SYSTEM_MULTICAST_IP);
});

// Timer
if (null == stream_timer) {
    stream_timer = setInterval(() => {
        try {
            // console.log('about to send ');
            let values = buf.deq();
            let n_agents = 33;
            // Got one sample. So increase count
            sample_count = sample_count + 1;
            // initialization
            let v = null;
            let theta = null;
            let p = null;
            let q = null;
            let node_id = null;
            //store timestamp only once
            let timestamp = values.readFloatLE(0);
            for (let id=0;id<n_agents;id++) {
                // Get id
                node_id = id+1;
                // Decipher values
                v = values.readFloatLE(node_id*4);
                theta = values.readFloatLE((node_id+33)*4);
                p = values.readFloatLE((node_id+33*2)*4);
                q = values.readFloatLE((node_id+33*3)*4);
                // Push to arrays
                arrayVM.push(node_id);
                arrayVM.push(v);
                arrayVA.push(node_id);
                arrayVA.push(theta);
                arrayP.push(node_id);
                arrayP.push(p);
                arrayQ.push(node_id);
                arrayQ.push(q);
            }
            // All data collected for a single common timestamp
            // So store data in a line
            console.log('writing sample ', sample_count);
            writeStreamVM.write(arrayVM.toString());
            writeStreamVM.write('\n');
            writeStreamVA.write(arrayVA.toString());
            writeStreamVA.write('\n');
            writeStreamP.write(arrayP.toString());
            writeStreamP.write('\n');
            writeStreamQ.write(arrayQ.toString());
            writeStreamQ.write('\n');
            // Clear the arrays
            arrayVM = [];
            arrayVA = [];
            arrayP = [];
            arrayQ = [];
            if (NUM_SAMPLE_TO_STORE == sample_count) {
                // Close file stream
                writeStreamVM.end();
                writeStreamVA.end();
                writeStreamP.end();
                writeStreamQ.end();
                sample_count = 0;
                arrayVM = [];
                arrayVA = [];
                arrayP = [];
                arrayQ = [];
                console.log('writing...');
                writeStreamVM = fs.createWriteStream(FILE_PATH_VM_TEMP);
                writeStreamVA = fs.createWriteStream(FILE_PATH_VA_TEMP);
                writeStreamP = fs.createWriteStream(FILE_PATH_P_TEMP);
                writeStreamQ = fs.createWriteStream(FILE_PATH_Q_TEMP);
                // Call python script now as data are available
                if (false == is_called_once) {
                    is_called_once = true;
                    callPython();
                } else {
                    //callPython();
                }
            }
        } catch (error) {
            // console.log(error); // No need to log
        }
    }, SAMPLE_TIME); // in ms
}

function callPython() {
    console.log('calling python...');
    const python = child_process.spawn('python', ['C:/Users/chakr138/Aelios/situationalAwareness/backend/algorithms/static_network_reconstruction/main.py']);
    python.stdout.on('data', function (data) {
        console.log('python >> ', data.toString());
    });
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });
}

