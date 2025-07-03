import React, { useState, useEffect, useReducer, useContext } from "react";
import "./analytics.css";
//import ntwrkDataFromBackEnd  from "../example_networks/case5.json"
import D3RealtimeNtwrkDataViz from "../components/d3Components/D3RealtimeNtwrkDataViz";
import { BE_SOCKET_CONTEXT } from "../context/socket";

const NavBar = () => {
  return <></>;
};

function reducerNtwrk(state, newState) {
  console.log(`state.nodes:${state.nodes.length}`);
  if (state.nodes.length != 0) {
    return newState;
  } else {
    return newState;
  }
}
function graphFromBE(ntwrkDataFromBackEnd) {
  let nodesFromBE = [];
  let linksFromBE = [];
  for (let item in ntwrkDataFromBackEnd) {
    //console.log(`parent: ${ntwrkDataFromBackEnd[item].id}`)
    let nodeObj = {
      name: ntwrkDataFromBackEnd[item].id,
      status: ntwrkDataFromBackEnd[item].status,
      data: ntwrkDataFromBackEnd[item],
    };
    nodesFromBE.push(nodeObj);
    for (let toItem in ntwrkDataFromBackEnd[item].network.to) {
      let linkObj = {
        source: ntwrkDataFromBackEnd[item].id,
        target: ntwrkDataFromBackEnd[item].network.to[toItem].id,
      };
      linksFromBE.push(linkObj);
    }
  }
  let graphFromBE = {
    nodes: nodesFromBE,
    links: linksFromBE,
  };
  return graphFromBE;
}

const Analytics = (props) => {
  const [ntwrkData, setNtwrkData] = useReducer(reducerNtwrk, {
    nodes: [],
    links: [],
  });
  const [beStatus, setBeStatus] = useState("disconnected");
  const [dataObj, setDataObj] = useState({});
  const [dataPkt, setDataPkt] = useState({});
  const [statusChangeData, setStatusChangeData] = useState({});
  const [samplingPeriod, setSamplingPeriod] = useState(1000); // default sampling Period is

  var socket = useContext(BE_SOCKET_CONTEXT);
  const emit = (sock, eventName, payLoad) => {
    sock.emit(eventName, payLoad);
  };
  const streamNtwrkButton = (sock) => {
    if (sock.connected) {
      console.log("I am here")
      emit(sock, "initialize", {});
    }
  };

  const stopNtwrkUpdateButton = (sock) => {
    if (sock.connected) {
      emit(sock, "stop_network_update", {});
    }
  };


  const initializeDataButton = (sock) => {
    if (sock.connected) {
      //    emit(backendSocket,"start",{id :4})
      emit(sock, "start", {});
    }
  };
  const stopDataButton = (sock) => {
    if (sock.connected) {
      emit(sock, "stop", {});
    }
  };

  const handleSamplingPeriodChange = (event) => {
    console.log(event.target.value);
    setSamplingPeriod(event.target.value);
  };

  const handleSubmitSamplingPeriod = (sock) => {
    console.log(`sample period is ${samplingPeriod}`);
    if (sock.connected) {
      emit(sock, `sampling_period`, { data: { samplingPeriod: samplingPeriod } });
    }
  };

  const backendSocketOnRoutes = (backendSocket) => {
    backendSocket.on("connect", () => {
      setBeStatus("connected");
    });
    backendSocket.on("network", (data) => {
      let jsonData = JSON.parse(data);
      let graph = graphFromBE(jsonData);
      setNtwrkData(graph);
    });

    backendSocket.on("data", (data) => {
      let jsonData = JSON.parse(data);
      setDataObj(jsonData);
    });
    backendSocket.on("disconnect", () => {
      setBeStatus("disconnected");
    });
    backendSocket.on("status_change", (data) => {
      setStatusChangeData(data);
      if (backendSocket.connected) {
        //   emit(backendSocket,"initialize",{})
      }
    });
  };

  useEffect(() => {
    backendSocketOnRoutes(socket);
  }, []);

  useEffect(() => {
    if (dataObj.timestamp) {
      let newX = dataObj.timestamp;
      let timeUtc = new Date(newX);
      console.log(
        `${timeUtc.getHours()}:${timeUtc.getMinutes()}:${timeUtc.getSeconds()}`
      );
      let newY = dataObj.load_bus.pd;
      let newId = dataObj.id;
      let newObj = { id: newId, x: newX, y: newY };
      setDataPkt(newObj);
    }
  }, [dataObj]);
  return (
    <>
      <div className="container-fluid analyticsGrid">
        <div className="navBar">
         
          <div>
            <button
              className="btn btn-secondary w-100 mb-2"
              onClick={() => {
                streamNtwrkButton(socket);
              }}
            >
              Stream Ntwrk
            </button>
            <div>
            <button
              className="btn btn-secondary w-100 mb-2"
              onClick={() => {
                stopNtwrkUpdateButton(socket);
              }}
            >
              Stop Ntwrk Update
            </button>
            </div>

            <h2></h2>
            <input
            className="form-control mb-2"
              type="number"
              value={samplingPeriod}
              id="samplingPeriod"
              onChange={handleSamplingPeriodChange}
            ></input>
            <button
              className="btn btn-secondary w-100 mb-2"
              onClick={() => {
                handleSubmitSamplingPeriod(socket);
              }}
            >
              Set Sampling Period (ms)
            </button>
            
            <button
              className="btn btn-secondary w-100 mb-2"
              onClick={() => {
                initializeDataButton(socket);
              }}
            >
              Chart Data
            </button>
            <button
              className="btn btn-secondary w-100 mb-2"
              onClick={() => {
                stopDataButton(socket);
              }}
            >
              Stop Charting
            </button>
            
           
          </div>
        </div>
        <div className="mainContent">
          {/* <div> <button onClick={()=>{initializeNtwrkButton(socket)}}>Intialize Ntwrks</button> <button onClick={()=>{initializeDataButton(socket)}}>Chart Data</button> <button onClick={()=>{stopDataButton(socket)}}>Stop Charting </button></div> */}
          <div className="d3CompAutoRowsGrid">
            <D3RealtimeNtwrkDataViz
              ntwrkData={ntwrkData}
              dataPkt={dataPkt}
              statusChangeData={statusChangeData}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Analytics;
