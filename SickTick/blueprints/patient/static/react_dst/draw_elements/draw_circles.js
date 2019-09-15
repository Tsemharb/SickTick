var draw_circles = function draw_circles(graph, x) {
	console.log('draw_circles');
	graph.append("circle").attr("cx", x(10)).attr("cy", 100).attr("r", 40).style("fill", "blue");
	graph.append("circle").attr("cx", x(50)).attr("cy", 100).attr("r", 40).style("fill", "red");
	graph.append("circle").attr("cx", x(100)).attr("cy", 100).attr("r", 40).style("fill", "green");
};

export default draw_circles;