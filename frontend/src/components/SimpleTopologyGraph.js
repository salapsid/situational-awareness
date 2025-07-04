import React, { useRef, useEffect } from "react";
import {
  select,
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  zoom,
} from "d3";

const SimpleTopologyGraph = ({ nodes, links }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const width = 800;
    const height = 600;
    const container = svg
      .attr("width", width)
      .attr("height", height)
      .append("g");

    svg.call(
      zoom().scaleExtent([0.5, 4]).on("zoom", (event) => {
        container.attr("transform", event.transform);
      })
    );

    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links).id((d) => d.name).distance(100))
      .force("charge", forceManyBody().strength(-200))
      .force("collide", forceCollide(20))
      .force("center", forceCenter(width / 2, height / 2));

    const link = container
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999");

    const node = container
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "#007bff");

    const label = container
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("font-size", 12)
      .attr("dx", 12)
      .attr("dy", ".35em");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [nodes, links]);

  return <svg ref={svgRef}></svg>;
};

export default SimpleTopologyGraph;
