import draw_everything from './graph_components/draw_graph_1.js'


class Graph_1 extends React.Component {
    componentDidMount() {
        draw_everything(this.props);
    }

    componentDidUpdate() {
        draw_everything(this.props);
    }

    render() {
        return (
            <div className='graph'/>
        )
    }
}


export default Graph_1;