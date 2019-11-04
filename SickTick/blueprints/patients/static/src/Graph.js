import draw_everything from './graph_components/draw_everything.js'


class Graph extends React.Component {
    componentDidMount() {
        draw_everything(this.props);
    }

    componentDidUpdate() {
        draw_everything(this.props);
    }

    render() {
        return (
            <div className='graph' />
        )
    }
}


export default Graph;