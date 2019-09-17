var draw_circles2 = function draw_circles2(graph, x) {
	graph.append("circle").attr("cx", x(25)).attr("cy", 200).attr("r", 40).style("fill", "black");
};

export default draw_circles2;