import React, { useRef, useEffect, useState } from "react";
import { select, line, curveCardinal } from "d3";


const SimpleLineChart=(props)=>{
const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
  const svgRef = useRef();

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const myLine = line()
      .x((value, index) => index * 50)
      .y(value => 150 - value)
      .curve(curveCardinal);
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("r", value => value)
    //   .attr("cx", value => value * 2)
    //   .attr("cy", value => value * 2)
    //   .attr("stroke", "red");
    svg
      .selectAll("path")
      .data([data])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, [data])

  return(
    <React.Fragment>
    <div  >
         <svg ref={svgRef}>   </svg>
    </div>
  
    </React.Fragment>
    )
    

}

export default SimpleLineChart