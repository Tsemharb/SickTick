const draw_circles2 = (graph, x, y) => {
	graph.append("circle")
	  .attr("cx", x(25)).attr("cy", y).attr("r", 40).style("fill", "black");
}


export default draw_circles2;