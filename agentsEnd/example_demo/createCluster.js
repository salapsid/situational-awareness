/******************************************************
 * Contains backend configuration
 *****************************************************/
/******************************************************
 * Imports
 *****************************************************/
import path from 'path';
import fs from 'fs';

let ENABLE_FILESAVE = true;
/**
 * Parses arguments from CLI
 */
function parseArguments() {
  // Custom user arguments starts from process.argv[2] //
  let network_name = null;
  let redundant = null;
  if (process.argv.length <= 2) {
    console.log('Not enough arguments, setting to default...');
  }
  [network_name = 'case5.json', ...redundant] = process.argv.slice(2);
  // TODO: Validate argument type
  return {
    network_name: network_name,
    rest: redundant,
  };
}

/**
 * Creates an ecosystem file named 'process-cluster.json' inside
 * pm2 folder for pm2 cluster
 */
function createPm2Ecosystem() {
    const args = parseArguments();
    const network_name = String(args.network_name);
    if (false == fs.existsSync('./'+network_name)) {
        console.log('No such file');
        return;
    }
    const file_name = './'+network_name;
    const network = fs.readFileSync(file_name);
    const json_network = JSON.parse(network);
    // Create PM2 ecosystem
    const processJson = { apps: [] };
    for (let agent_i in json_network) {
        processJson.apps.push({
        name: 'demo_'+network_name,
        script: 'server.js',
        exec_mode: 'fork',
        cwd: '../',
        args: String(json_network[agent_i].id)+
        ' '+String(json_network[agent_i].ip)+' '+String(json_network[agent_i].port),
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        error_file: './example_demo/logs/error_logs.log',
        out_file: './example_demo/logs/out_log.log',
        });
    }
    if (true == ENABLE_FILESAVE) {
      const json = JSON.stringify(processJson, null, 2);
      fs.writeFile(path.resolve('./ecosystem.json'), json, 'utf8', (err) => {
          if (err) {
          console.log('Could not create file: Error: ', err);
          } else {
          console.log('successfully created pm2 cluster ecosystem');
          }
      });
    }
}

createPm2Ecosystem();
