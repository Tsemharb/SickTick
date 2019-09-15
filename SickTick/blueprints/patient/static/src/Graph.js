import draw from './draw_graph/draw.js'

class Graph extends React.Component{
	componentDidMount(){
		draw(this.props)
	}

	componentDidUpdate(){
		draw(this.props)
	}

	render(){
		return(
			<div className='graph' />
		)
	}
}

// function Graph(s){
// 	console.log(s.patients);
// 	return(
// 		<div>{s.length}</div>
// 	)
// }

export default Graph;