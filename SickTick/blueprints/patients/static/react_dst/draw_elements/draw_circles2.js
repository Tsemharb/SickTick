var draw_circles2 = function draw_circles2(graph, x) {
	console.log('draw_circles');
	graph.append("circle").attr("cx", x(20)).attr("cy", 150).attr("r", 40).style("fill", "black");
	// 	graph.append("circle")
	// 	  .attr("cx", x(50)).attr("cy", 100).attr("r", 40).style("fill", "red");
	// 	graph.append("circle")
	// 	  .attr("cx", x(100)).attr("cy", 100).attr("r", 40).style("fill", "green");
};

export default draw_circles2;