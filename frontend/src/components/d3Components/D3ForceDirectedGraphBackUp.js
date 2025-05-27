import React, {useEffect, useState, useReducer, useRef} from "react"
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
    axisBottom,scaleTime,scaleUtc
  } from "d3";
  import PropTypes, { node } from "prop-types"
 


const D3ForceDirectedGraph = ({ntwrkData,dataPkt})=>{
    const [nodeChartIdsArray,setNodeChartIdsArray]=useReducer((newNodeChartIdsArray)=>{  
        return newNodeChartIdsArray
    },[])
    const [toolipDivOpacity,setTooltipDivOpacity]=useState(0)
    const [ts,setTs]=useState({})
    const d3ContainerDivRef=useRef() 
    const d3ContainerDiv = select(d3ContainerDivRef.current)
    const toolTipDivRef=useRef()
    const tooltipDiv=select(toolTipDivRef.current)
    const toolTipDivStyle={
        opacity:0,
        position:"absolute",
        border:"solid",
        backgroundColor:"white",
    }
    let pathDataArray=[{x:41,y:50},{x:42,y:52},{x:43,y:54},{x:44,y:56},{x:45,y:58}]
    
   

    useEffect(()=>{
        if (!d3ContainerDiv){ return}
        d3ContainerDiv.selectAll("*").remove();
        d3ContainerDiv.attr("id","d3ContainerDiv")
        const graph= ntwrkData // Check what really happens here. is graph simply a replica of ntwrkData? (they are the pointer to the same list?)
        console.log(graph)
        // Test for data coming in
        console.log(`Triggered as pathDataArray UseEffect fired`)
        const ntwrkDiv=d3ContainerDiv.append("div").attr("class","networkCard")
        ntwrkDiv.attr("id","ntwrkDiv")
        //var ntwrkDivWidth = select('#ntwrkDiv').node().getBoundingClientRect().width;
        const svg =ntwrkDiv.append("svg")

        /* defining the svg element */
        const width=600
        const height=600
        svg
        .attr("width",width)
        .attr("height",height)
       
        /* the function below takes a node d and an d3 svg element as an input, draws a circle and adds functionality  to the node */
        const drawNode = (d,svg)=> {
            let color="red"
            if (d.status== "connected"|| d.status=="1"){
                color="green"
            }
            let node=svg.append("circle") //append a circle at nodes x and y coordinates
                .attr("cx", d.x)
                .attr("cy",d.y)
                .attr("r",10)
                .style("fill",color)

                svg.append("text")
                .attr("x", d.x)             
                .attr("y", d.y)    
                .text(d.name)
            // add a onclick function that appends text at the x and y coordinates of a node; text has the name of the node
            node.on("click", function() { 
                    //console.log(d.name); 
                    // svg.selectAll("text").remove();
                    // svg.append("text")
                    // .attr("x", d.x)             
                    // .attr("y", d.y)    
                    // .text(d.name)
                    let childDivId=d.data.id
                    let childDiv=d3ContainerDiv.append("div").attr("id",childDivId)
                    setNodeChartIdsArray(nodeChartIdsArray.push(childDivId))
                    if(!ts[childDivId]){
                        pathDataArray=[{}]
                    }
                    else{
                        pathDataArray=ts[childDivId]
                    }
                    appendNodeData(childDiv,d,pathDataArray)
                   // console.log(nodeChartIdsArray)

            

                    
                });
            
        }
        /* the function drawLink takes a link l as an input, draws a link as a line and adds functionality  to the link */
        const drawLink= (l,svg)=> {
            svg.append("line")
                .attr("x1", l.source.x)
                .attr("y1",l.source.y)
                .attr("x2",l.target.x)
                .attr("y2",l.target.y)
                .attr("stroke", "black")
            
        }
        /* the function update draws a nodes and link after clearing the svg; this update function is called on each tick*/ 
        const update=()=>{
            svg.selectAll("*").remove();
            graph.nodes.forEach((d)=>drawNode(d,svg))
            graph.links.forEach((l)=>drawLink(l,svg))
           // console.log("I am ticking")
        }
        
        const collisonRadius=20
        const chargeStrength=-200
        const simulation=forceSimulation() // setting simulation 
            .force("x",forceX(width/2)) // force all nodes x position to width/2
            .force("y",forceY(height/2)) // force all nodes y position to height/2
            .force("collide",forceCollide(collisonRadius)) // avoid any intersection of nodes with a radius collisonRadius
            .force("charge",forceManyBody().strength(chargeStrength)) // attract nodes in proportion to chargeStrength (-ve values imply repulsion)
            .force("link",forceLink().id((d)=>{ return d.name}))// forceLink id is not provided in the graph.links data; thus id is created here; investigate further
            .on("tick",update)

        simulation.nodes(graph.nodes) // pass graph.nodes to the simulation
        simulation.force("link").links(graph.links) // pass graph.links to the simulation
    },[ntwrkData])














    const appendNodeData=(elem,d,pathDataArray)=>{

        //let pathDataArray=[{x:5,y:5},{x:10,y:15},{x:20,y:7},{x:30,y:18},{x:40,y:10}]
        let children=d.data.network.to
        var neighborsText=''
        if (children.length==0){
            neighborsText = "No Children"
        }
        else{
            neighborsText= children.map( item => ` ${item.id} `)
        }
        elem.attr("class","nodeCard")
        elem.append("div")
            .attr("class","nodeCardInfoDiv")
            .html(` 
                         <p> id: ${d.data.id},  ip:  ${d.data.ip}/${d.data.port},
                         Children: ${neighborsText} </p>
        `)
        elem.append("div")
            .attr("class","nodeCardkillDiv")
            .html(`X`)
            .on('click',(e)=>{
                
                let parent=e.target.parentNode
                let grandFaNode=parent.parentNode
                grandFaNode.removeChild(parent)
                let idIndex=nodeChartIdsArray.indexOf(d.data.id)
                setNodeChartIdsArray(nodeChartIdsArray.splice(idIndex,1))
                setTooltipDivOpacity(0)
                //console.log(nodeChartIdsArray)
                
                
            })
    
    /*************** CODE FOR CREATING CHART  */
        const parentDiv=elem.append("div")
                    .attr("class","nodeCardChartDiv")
        const pathDiv= parentDiv.append("div")
        pathDiv.attr("id","pathDiv")
        const pathSvg=pathDiv.append("svg")
        
        var pathSvgWidth = select('#pathDiv').node().getBoundingClientRect().width;
        console.log(pathSvgWidth)
        //var pathSvgHeight = select('#pathDiv').node().getBoundingClientRect().height;
        var pathSvgHeight=pathSvgWidth/2
        pathSvg.attr("height",pathSvgHeight)
                .attr("width",pathSvgWidth)
        console.log(pathSvgHeight)
        
        let p=0
        //console.log(`p: ${p}`)
        // Height and width of each line plot is specified here; this is the only input apart from data that is needed here
        let height=pathSvgHeight/1.5
        let width=pathSvgWidth
        var margin={left:30, right:5, top:5, bottom:0}
        let shiftY=p*200+margin.top
        let shiftX=margin.left

        let pathSvgGroup=pathSvg.append("g").attr("transform","translate("+shiftX+","+shiftY+")")
        height=height+2*margin.top
        width=width-margin.left-margin.right

        let y=scaleLinear()
                .domain(extent(pathDataArray, d=>d.y))
                .range([height,0])
        const convToDate=(val)=>{
                let newDate=new Date(val)
                return newDate
            }
        let extentRes=extent(pathDataArray, (d)=>{
            let newDate= new Date(d.x)
            return newDate}
            )
        
        let x=scaleUtc()
            //  .domain(extent(pathDataArray, d=>d.x))
            .domain(extentRes)
            .range([0,width])
        let yAxis=axisLeft(y)
                .ticks(3)
        let xAxis=axisBottom(x)
                .ticks(5)
                   
    
        var myLine=line()
        .x(d=>x(d.x))
        .y(d=>y(d.y))
        .curve(curveCardinal)
         
       
         pathSvgGroup.append("path")
             .attr("d",myLine(pathDataArray))
             .attr("stroke","blue")
             .attr("fill","none")
         pathSvgGroup.selectAll("circle.grp"+p)
                 .data(pathDataArray)
                 .join("circle")
                 .attr("cx",d=>x(d.x))
                 .attr("cy",d=>y(d.y))
                 .attr("r",2)
                 .attr("class",(d,i)=>"grp"+i)
                 .on("mouseover",function(event,d){
                    tooltipDiv.style("opacity","1")
                    .style("left",event.pageX+"px")
                    .style("top",event.pageY+"px");
                    console.log( `date:  ${convToDate(d.x)}`)
                    tooltipDiv.html(`
                    
                   <p style="margin:0"> ${convToDate(d.x)} </p>
                   <p style="margin:0"> ${d.y}</p>
                
                  `);
                  });
         pathSvgGroup.append("g")
                     .attr("class","axis y")
                     .style("font", "18px times")
                     .call(yAxis)
         pathSvgGroup.append("g")
         .attr("class","axis x")
         .attr("transform","translate(0,"+height+")")
         .style("font", "18px times")
         .call(xAxis)
    
    // /******************************************************* */
    
        
    }
    // /* Here we provide a ref to the svg element in the dom to d3 (use useRef() to attach a ref attribute to <svg> and provide it to d3. Once this the svg is created as a d3 element use d3 exlusively. React updates the svg element only and d3 updates everything inside svg) */
  


   
  
    useEffect(()=>{   
        if (!d3ContainerDiv){ return}
    
    const removeCharts=()=>{
        console.log("I am inside removeCharts")
       select('#d3ContainerDiv')
                       .selectAll('div:not(#ntwrkDiv)')
                       .remove()  
    }

    const redrawCharts=()=>{
        console.log("I am inside redrawCharts")
        
        for (let i in nodeChartIdsArray){
            console.log(`i: ${nodeChartIdsArray[i]}`)
            let d=ntwrkData.nodes.find(node => node.data.id==nodeChartIdsArray[i])
            let childDiv=d3ContainerDiv.append("div").attr("id",i)
            let childDivId=d.data.id
            if(!ts[childDivId]){
                pathDataArray=[{}]
            }
            else{
                pathDataArray=ts[childDivId]
            }
            appendNodeData(childDiv,d,pathDataArray)

        }
    }
    console.log("From  D3Force Comp: useEffect with dataPkt  dependency")
    console.log(dataPkt)
    let dataPktId= dataPkt.id
    let xyDataObjAppend={x:dataPkt.x,y:dataPkt.y}
    //console.log(xyDataObjAppend)
   if(!ts[dataPktId]){
       let newTs={...ts,[dataPktId]:[xyDataObjAppend]}
       //console.log(newTs)
       setTs(newTs)
   }
   else{
    let newTs={...ts,[dataPktId]:[...ts[[dataPktId]],xyDataObjAppend]}
    //console.log(newTs)
    setTs(newTs)
   }
  console.log(ts)
 
    removeCharts()
    redrawCharts()
    

       

    },[dataPkt]) 



    return(
    <React.Fragment>

    <div className="d3CompTwoColAutoRowsGrid" ref={d3ContainerDivRef}>
    </div>
    <div  style={toolTipDivStyle} ref={toolTipDivRef} > 
    </div>
    
  
    </React.Fragment>
    )
    
}

D3ForceDirectedGraph.propTypes={
    ntwrkData: PropTypes.object.isRequired

}

export default D3ForceDirectedGraph