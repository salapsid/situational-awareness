import React, { useEffect, useState, useReducer, useRef } from "react";
import {
  select,
  forceSimulation,
  forceManyBody,
  forceX,
  forceY,
  forceCollide,
  forceLink,
  path,
  line,
  curveCardinal,
  scaleLinear,
  axisLeft,
  extent,
  axisBottom,
  scaleTime,
  scaleUtc,
  zoom,
  zoomTransform,
} from "d3";
import PropTypes from "prop-types";
const createZoomableLineChart = (elem, pathDataArray,tooltipDiv) => {
  /*************** CODE FOR CREATING CHART  */
  //elem is the div element in which the chart will be created
  //pathDataArray is the time series which is to be charted
  const parentDiv = elem.append("div").attr("class", "nodeCardChartDiv");
  const pathDiv = parentDiv.append("div");
  pathDiv.attr("id", "pathDiv");
  const pathSvg = pathDiv.append("svg");

  var pathSvgWidth = select("#pathDiv").node().getBoundingClientRect().width;
  console.log(pathSvgWidth);
  //var pathSvgHeight = select('#pathDiv').node().getBoundingClientRect().height;
  var pathSvgHeight = pathSvgWidth / 2;
  pathSvg.attr("height", pathSvgHeight).attr("width", pathSvgWidth);
  console.log(pathSvgHeight);

  // Height and width of each line plot is specified here; this is the only input apart from data that is needed here
  let height = pathSvgHeight / 1.5;
  let width = pathSvgWidth;
  var margin = { left: 30, right: 5, top: 5, bottom: 0 };
  let shiftY = margin.top;
  let shiftX = margin.left;

  let pathSvgGroup = pathSvg
    .append("g")
    .attr("transform", "translate(" + shiftX + "," + shiftY + ")");
  height = height + 2 * margin.top;
  width = width - margin.left - margin.right;

  const y = scaleLinear()
    .domain(extent(pathDataArray, (d) => d.y))
    .range([height, 0]);
  const convToDate = (val) => {
    let newDate = new Date(val);
    return newDate;
  };
  let extentRes = extent(pathDataArray, (d) => {
    let newDate = new Date(d.x);
    return newDate;
  });

  const x = scaleUtc().domain(extentRes).range([0, width]);

  const xAxis = (g, x) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .style("font", "18px times")
      .call(
        axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );
  const gx = pathSvgGroup.append("g").call(xAxis, x);

  const yAxis = (g, y) =>
    g.attr("transform", `translate(0,0)`).call(axisLeft(y).ticks(10));

  pathSvgGroup.append("g").call(yAxis, y);

  const lineGen = (data, x) => {
    let lineTemp = line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(curveCardinal);
    return lineTemp(data);
  };

  const clip = { id: "clipId" };
  pathSvgGroup
    .append("clipPath")
    .attr("id", clip.id)
    .append("rect")
    .attr("x", "0")
    .attr("y", "0")
    .attr("width", "100%")
    .attr("height", "100%");
  const path = pathSvgGroup
    .append("path")
    // .attr("d",myLine(pathDataArray))
    .attr("clip-path", `url(#${clip.id})`) // This change from observable original was needed
    .attr("d", lineGen(pathDataArray, x))
    .attr("stroke", "blue")
    .attr("fill", "none");
  pathSvgGroup
    .selectAll("circle.grp")
    .data(pathDataArray)
    .join("circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 2)
    .attr("class", (d, i) => "grp" + i)
    .on("mouseover", function (event, d) {
      tooltipDiv
        .style("opacity", "1")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px");
      console.log(`date:  ${convToDate(d.x)}`);
      tooltipDiv.html(`

<p style="margin:0"> ${convToDate(d.x)} </p>
<p style="margin:0"> ${d.y}</p>

`);
    });

  // /******************************************************* */
  function zoomed(event) {
    console.log(event);
    const zoomState = zoomTransform(pathSvg.node());
    console.log(zoomState);
    const xz = event.transform.rescaleX(x);
    path.attr("d", lineGen(pathDataArray, xz));
    pathSvgGroup
      .selectAll("circle")
      .attr("cx", (d) => xz(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 2);
    gx.call(xAxis, xz);
  }
  const zoomFunc = zoom()
    .scaleExtent([1, 32])
    .extent([
      [margin.left, 0],
      [width - margin.right, height],
    ])
    .translateExtent([
      [margin.left, -Infinity],
      [width - margin.right, Infinity],
    ])
    .on("zoom", zoomed);

  pathSvg.call(zoomFunc); // calling zoomFunc on pathSvgGroup does not work
};
const appendNodeData = (
  elem,
  d,
  pathDataArray,
  nodeChartIdsArray,
  setNodeChartIdsArray,
  tooltipDiv
) => {
  //elem is a d3 element
  //d represents the node in the graph
  //pathDataArray is a array representing the timeseries for the node
  //nodeChartsIdsArray maintains an array of ids that are opended for charting;
  //setNodeChartIdsArray is a function that sets the nodeChartsIdsArray
  //tooltipDiv is a div for a tooltip
console.log(tooltipDiv)
  let children = d.data.network.to;
  var neighborsText = "";
  if (children.length == 0) {
    neighborsText = "No Children";
  } else {
    neighborsText = children.map((item) => ` ${item.id} `);
  }
  elem.attr("class", "nodeCard");
  elem.append("div").attr("class", "nodeCardInfoDiv").html(` 
                     <p> id: ${d.data.id},  ip:  ${d.data.ip}/${d.data.port},
                     Children: ${neighborsText} </p>
    `);
  // the function below kills the chart div for the node when X is clicked, removes the id from nodeChartIdsArray and turns off tooltip
  elem
    .append("div")
    .attr("class", "nodeCardkillDiv")
    .html(`X`)
    .on("click", (e) => {
      let parent = e.target.parentNode;
      let grandFaNode = parent.parentNode;
      grandFaNode.removeChild(parent);
      let idIndex = nodeChartIdsArray.indexOf(d.data.id);
      setNodeChartIdsArray(nodeChartIdsArray.splice(idIndex, 1));
      tooltipDiv.style("opacity", 0);
    });

  createZoomableLineChart(elem, pathDataArray,tooltipDiv);
};
const redrawCharts = (
  graph,
  idsArray,
  timeSeries,
  divElem,
  nodeChartIdsArray,
  setNodeChartIdsArray,
  tooltipDiv
) => {
  //redraws charts for all nodes with id in nodeChartIdsArray
 
  let pathDataArray = [{}];
  for (let i in idsArray) {
    // console.log(`i: ${nodeChartIdsArray[i]}`)
    let d = graph.nodes.find((node) => node.data.id == idsArray[i]);
    let childDiv = divElem.append("div").attr("id", i);
    let childDivId = d.data.id;
    if (!timeSeries[childDivId]) {
      pathDataArray = [{}];
    } else {
      pathDataArray = timeSeries[childDivId];
    }
    appendNodeData(
      childDiv,
      d,
      pathDataArray,
      nodeChartIdsArray,
      setNodeChartIdsArray,
      tooltipDiv
    );
  }
};

const removeCharts = (divElem) => {
  // removes all  children of div element 'divElem' leaving out the child div with id ntwrkDiv
  divElem.selectAll("div:not(#ntwrkDiv)").remove();
};

const drawForceDirectedNtwrk = (
    d3ContainerDiv,
    ntwrkData,
    width = 600,
    height = 600,
    nodeChartIdsArray,
    setNodeChartIdsArray,
    ts,
    tooltipDiv
  ) => {
    d3ContainerDiv.selectAll("*").remove();
    d3ContainerDiv.attr("id", "d3ContainerDiv");
    const ntwrkDiv = d3ContainerDiv
      .append("div")
      .attr("class", "networkCard");
    ntwrkDiv.attr("id", "ntwrkDiv");
    //var ntwrkDivWidth = select('#ntwrkDiv').node().getBoundingClientRect().width;
    const svg = ntwrkDiv.append("svg");

    /* defining the svg element */
    svg.attr("width", width).attr("height", height);

    /* the function below takes a node d and an d3 svg element as an input, draws a circle and adds functionality  to the node */
    const drawNode = (d, svg,tooltipDiv) => {
      let color = "red";
      if (d.status == "connected" || d.status == "1") {
        color = "green";
      }
      let node = svg
        .append("circle") //append a circle at nodes x and y coordinates
        .attr("id",`circleOfNode${d.data.id}`)
        .attr("cx", d.x)
        .attr("cy", d.y)
        .attr("r", 10)
        .attr("fill", color);
        //let trial= select("#node"+d.data.id).attr("fill")
        // let trial= select(`#circleOfNode${d.data.id}`).attr("fill")
        // console.log(trial)
      svg.append("text").attr("x", d.x).attr("y", d.y).text(d.name);
      // add a onclick function that appends text at the x and y coordinates of a node; text has the name of the node
      node.on("click", function () {
        let pathDataArray = [{}];
        let childDivId = d.data.id;
        let childDiv = d3ContainerDiv.append("div").attr("id", childDivId);
        setNodeChartIdsArray(nodeChartIdsArray.push(childDivId));
        if (!ts[childDivId]) {
          pathDataArray = [{}];
        } else {
          pathDataArray = ts[childDivId];
        }
        appendNodeData(
          childDiv,
          d,
          pathDataArray,
          nodeChartIdsArray,
          setNodeChartIdsArray,
          tooltipDiv
        );
        // select(`#circleOfNode${d.data.id}`).dispatch("colorChangeToRed")
      });
      node.on("colorChangeToRed",()=>{
        select(`#circleOfNode${d.data.id}`).attr("fill","red")
      })
      node.on("colorChangeToGreen",()=>{
        select(`#circleOfNode${d.data.id}`).attr("fill","green")
      })
    };
    /* the function drawLink takes a link l as an input, draws a link as a line and adds functionality  to the link */
    const drawLink = (l, svg) => {
      svg
        .append("line")
        .attr("x1", l.source.x)
        .attr("y1", l.source.y)
        .attr("x2", l.target.x)
        .attr("y2", l.target.y)
        .attr("stroke", "black");
    };
    /* the function update draws a nodes and link after clearing the svg; this update function is called on each tick*/
    const update = () => {
      svg.selectAll("*").remove();
      ntwrkData.nodes.forEach((d) => drawNode(d, svg,tooltipDiv));
      ntwrkData.links.forEach((l) => drawLink(l, svg));
    };

    const collisonRadius = 20;
    const chargeStrength = -200;
    const simulation = forceSimulation() // setting simulation
      .force("x", forceX(width / 2)) // force all nodes x position to width/2
      .force("y", forceY(height / 2)) // force all nodes y position to height/2
      .force("collide", forceCollide(collisonRadius)) // avoid any intersection of nodes with a radius collisonRadius
      .force("charge", forceManyBody().strength(chargeStrength)) // attract nodes in proportion to chargeStrength (-ve values imply repulsion)
      .force(
        "link",
        forceLink().id((d) => {
          return d.name;
        })
      ) // forceLink id is not provided in the graph.links data; thus id is created here; investigate further
      .on("tick", update);

    simulation.nodes(ntwrkData.nodes); // pass graph.nodes to the simulation
    simulation.force("link").links(ntwrkData.links); // pass graph.links to the simulation
  };

const D3ForceDirectedGraph = ({ ntwrkData,dataPkt,statusChangeData }) => {
  const [nodeChartIdsArray, setNodeChartIdsArray] = useReducer(
    (newNodeChartIdsArray) => {
      return newNodeChartIdsArray;
    },
    []
  );
  const [ts, setTs] = useState({});
  const d3ContainerDivRef = useRef();
  const d3ContainerDiv = select(d3ContainerDivRef.current);
  const toolTipDivRef = useRef();
  const tooltipDiv = select(toolTipDivRef.current);
  const toolTipDivStyle = {
    opacity: 0,
    position: "absolute",
    border: "solid",
    backgroundColor: "white",
  };
  
  useEffect(() => {
    if (!d3ContainerDiv || !tooltipDiv) {
      return;
    }
 

    drawForceDirectedNtwrk(
        d3ContainerDiv,
        ntwrkData,
        600,
        600,
        nodeChartIdsArray,
        setNodeChartIdsArray,
        ts,
        tooltipDiv
      )

    

    // d3ContainerDiv.selectAll("*").remove();
    // d3ContainerDiv.attr("id", "d3ContainerDiv");
    // const ntwrkDiv = d3ContainerDiv
    //   .append("div")
    //   .attr("class", "networkCard");
    // ntwrkDiv.attr("id", "ntwrkDiv");
    // //var ntwrkDivWidth = select('#ntwrkDiv').node().getBoundingClientRect().width;
    // const svg = ntwrkDiv.append("svg");

    // /* defining the svg element */
    // let width=600
    // let height=600
    // svg.attr("width", width).attr("height", height);

    // /* the function below takes a node d and an d3 svg element as an input, draws a circle and adds functionality  to the node */
    // const drawNode = (d, svg) => {
    //   let color = "red";
    //   if (d.status == "connected" || d.status == "1") {
    //     color = "green";
    //   }
    //   let node = svg
    //     .append("circle") //append a circle at nodes x and y coordinates
    //     .attr("cx", d.x)
    //     .attr("cy", d.y)
    //     .attr("r", 10)
    //     .style("fill", color);

    //   svg.append("text").attr("x", d.x).attr("y", d.y).text(d.name);
    //   // add a onclick function that appends text at the x and y coordinates of a node; text has the name of the node
    //   node.on("click", function () {
    //     let pathDataArray = [{}];
    //     let childDivId = d.data.id;
    //     let childDiv = d3ContainerDiv.append("div").attr("id", childDivId);
    //     setNodeChartIdsArray(nodeChartIdsArray.push(childDivId));
    //     if (!ts[childDivId]) {
    //       pathDataArray = [{}];
    //     } else {
    //       pathDataArray = ts[childDivId];
    //     }
    //     appendNodeData(
    //       childDiv,
    //       d,
    //       pathDataArray,
    //       nodeChartIdsArray,
    //       setNodeChartIdsArray,
    //       tooltipDiv
    //     );
    //   });
    // };
    // /* the function drawLink takes a link l as an input, draws a link as a line and adds functionality  to the link */
    // const drawLink = (l, svg) => {
    //   svg
    //     .append("line")
    //     .attr("x1", l.source.x)
    //     .attr("y1", l.source.y)
    //     .attr("x2", l.target.x)
    //     .attr("y2", l.target.y)
    //     .attr("stroke", "black");
    // };
    // /* the function update draws a nodes and link after clearing the svg; this update function is called on each tick*/
    // const update = () => {
    //   svg.selectAll("*").remove();
    //   ntwrkData.nodes.forEach((d) => drawNode(d, svg));
    //   ntwrkData.links.forEach((l) => drawLink(l, svg));
    // };

    // const collisonRadius = 20;
    // const chargeStrength = -200;
    // const simulation = forceSimulation() // setting simulation
    //   .force("x", forceX(width / 2)) // force all nodes x position to width/2
    //   .force("y", forceY(height / 2)) // force all nodes y position to height/2
    //   .force("collide", forceCollide(collisonRadius)) // avoid any intersection of nodes with a radius collisonRadius
    //   .force("charge", forceManyBody().strength(chargeStrength)) // attract nodes in proportion to chargeStrength (-ve values imply repulsion)
    //   .force(
    //     "link",
    //     forceLink().id((d) => {
    //       return d.name;
    //     })
    //   ) // forceLink id is not provided in the graph.links data; thus id is created here; investigate further
    //   .on("tick", update);

    // simulation.nodes(ntwrkData.nodes); // pass graph.nodes to the simulation
    // simulation.force("link").links(ntwrkData.links); // pass graph.links to the simulation
   
  }, [ntwrkData]);

  useEffect(() => {
    if (!d3ContainerDiv) {
      return;
    }
    let dataPktId = dataPkt.id;
    let xyDataObjAppend = { x: dataPkt.x, y: dataPkt.y };
    //console.log(xyDataObjAppend)
    if (!ts[dataPktId]) {
      let newTs = { ...ts, [dataPktId]: [xyDataObjAppend] };
      //console.log(newTs)
      setTs(newTs);
    } else {
      console.log(ts);
      let newTs = { ...ts, [dataPktId]: [...ts[[dataPktId]], xyDataObjAppend] };
      //console.log(newTs)
      setTs(newTs);
    }
    removeCharts(d3ContainerDiv);
    redrawCharts(
      ntwrkData,
      nodeChartIdsArray,
      ts,
      d3ContainerDiv,
      nodeChartIdsArray,
      setNodeChartIdsArray,
      tooltipDiv
    );
  }, [dataPkt]);

  useEffect(()=>{
    if (!d3ContainerDiv) {
        return;
      }
      console.log(`I am here`)
      console.log(statusChangeData)
      if (statusChangeData.id){
          let elem=select(`#circleOfNode${statusChangeData.id}`)
      console.log(elem.attr("fill")) 
      if(statusChangeData.status==1){
        elem.dispatch("colorChangeToGreen")
      }
      if(statusChangeData.status==0){
        elem.dispatch("colorChangeToRed")
    }
    }
      
  },[statusChangeData])

  return (
    <React.Fragment>
      <div className="d3CompTwoColAutoRowsGrid" ref={d3ContainerDivRef}></div>
      <div style={toolTipDivStyle} ref={toolTipDivRef}></div>
    </React.Fragment>
  );
};

D3ForceDirectedGraph.propTypes = {
  ntwrkData: PropTypes.object.isRequired,
  dataPkt:PropTypes.object.isRequired,
  statusChangeData:PropTypes.object.isRequired
};

export default D3ForceDirectedGraph;
