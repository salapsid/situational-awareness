## RUN PROCEDURE
* Open a terminal and  "npm start".
* Optional arguments: id ip port
* **example**: "npm start 1 localhost 3000" will give the agent an ID="1" and start a server on "http"//localhost:3000"
	for backend to connect to.
	* Default ID="1", default ip="localhost", default port=3000
* For automatic agent creation:
	1. Install latest version of node.js
	2. Install "pm2" globally ("npm install pm2@latest -g")(If this creates problem, please try "pm2 update")
	3. "cd ./example_demo"
	4. "node createCluster.js case5.json" or "node createCluster.js case30.json"
	5. in terminal, "pm2 start --interpreter babel-node ecosystem.json".
	This will automatically spawn all the agents in the specified network. Check "./example_demo/logs/" for terminal log of each agent.
## FILE CONTAINING EVENTS
./connection/events.js



