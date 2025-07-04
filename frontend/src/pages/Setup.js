import React, { useState } from "react";
import SimpleTopologyGraph from "../components/SimpleTopologyGraph";

const Setup = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [linkSource, setLinkSource] = useState("");
  const [linkTarget, setLinkTarget] = useState("");

  const addNode = () => {
    if (!nodeName.trim()) return;
    const id = nodes.length + 1;
    setNodes([...nodes, { name: nodeName.trim(), status: 1, data: { id } }]);
    setNodeName("");
  };

  const addLink = () => {
    if (linkSource && linkTarget && linkSource !== linkTarget) {
      setLinks([...links, { source: linkSource, target: linkTarget }]);
      setLinkSource("");
      setLinkTarget("");
    }
  };

  const clearAll = () => {
    setNodes([]);
    setLinks([]);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Setup</h2>
      <p className="lead text-center">Build a mock IoT topology to visualize.</p>
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <h5>Add Node</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Node name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={addNode}>
            Add Node
          </button>
        </div>
        <div className="col-md-4 mb-3">
          <h5>Add Link</h5>
          <select
            className="form-control mb-2"
            value={linkSource}
            onChange={(e) => setLinkSource(e.target.value)}
          >
            <option value="">Source node</option>
            {nodes.map((n) => (
              <option key={n.name} value={n.name}>
                {n.name}
              </option>
            ))}
          </select>
          <select
            className="form-control mb-2"
            value={linkTarget}
            onChange={(e) => setLinkTarget(e.target.value)}
          >
            <option value="">Target node</option>
            {nodes.map((n) => (
              <option key={n.name} value={n.name}>
                {n.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary w-100" onClick={addLink}>
            Add Link
          </button>
        </div>
        <div className="col-md-4 mb-3 d-flex align-items-end">
          <button className="btn btn-secondary w-100" onClick={clearAll}>
            Clear Topology
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <SimpleTopologyGraph nodes={nodes} links={links} />
      </div>
    </div>
  );
};

export default Setup;
