import draw from './graph_components/draw.js'

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


export default Graph;
