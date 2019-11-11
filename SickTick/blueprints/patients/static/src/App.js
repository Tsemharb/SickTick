import Clock from './Clock.js'
import Graph from './Graph.js'
import General_info from './General_info.js'
import Temp_controller from './controller_components/Temp_controller.js'
import Ab_controller from './controller_components/Ab_controller.js'
import path from './path.js'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            drawGraph: false,
            viewport: false,
            patient: {}
        };
    }

    componentDidMount() {
        let location = window.location.href;
        let patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id
        fetch(path + patient_id)
            .then(response => response.json()
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        drawGraph: false,
                        drawTemp: true,
                        drawAb: true,
                        viewport: false,
                        patient: data
                    });
                })
            );
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log(nextState.viewport);
        return !nextState.viewport;
    }

    onDraw = () => this.setState({ drawGraph: true, viewport: false });
    toggleTemp = () => this.setState({ drawTemp: !this.state.drawTemp, viewport: false });
    toggleAb = () => this.setState({ drawAb: !this.state.drawAb, viewport: false });
    toggleSingleAb = e => {
        let data = this.state.patient;
        for (let i = 0; i < data.antibiotics.length; i++) {
            if (data.antibiotics[i].name == e.target.id) {
                data.antibiotics[i].draw = e.target.checked
            }
        }
        this.setState({ patient: data, viewport: false })
    };

    handleViewportPosition = (e) => {
        e.target.id === 'viewport_x1' ?
            this.setState({ viewport_start: e.target.value, viewport: true }) :
            this.setState({ viewport_end: e.target.value, viewport: true })
    }

    render() {
        let { isLoaded, drawGraph, drawTemp, drawAb, patient, viewport_start, viewport_end } = this.state;
        if (!isLoaded) {
            return <div> loading... </div>;
        } else {
            return (
                <div>
                  <Clock />
                  <hr/>
                  <General_info info={patient}/>
                  <div className='app'>
                    <div className='app__graph'>
                      {drawGraph ? <Graph graphData={{patient, drawTemp, drawAb, viewport_start, viewport_end}} /> 
                                 : <div className='placeholder'></div>}
                    </div>
                    <div className="app__control-panel">
                      {isLoaded ? <div>
                                    <Temp_controller temp = {patient.temperature} 
                                                     drawTemp = {this.state.drawTemp} 
                                                     toggleTemp = {this.toggleTemp} />
                                    <Ab_controller antibiotics = {patient.antibiotics} 
                                                   drawAb = {this.state.drawAb} 
                                                   toggleAb = {this.toggleAb}
                                                   toggleSingleAb = {this.toggleSingleAb} />
                                  </div>
                                : null}
                      <button onClick = {this.onDraw}> plot </button>
                    </div>
                    <div className="viewport_data">
                      <input id="viewport_x1"type="text" pattern="[0-9]*" onChange={this.handleViewportPosition}/>
                      <input id="viewport_x2"type="text" pattern="[0-9]*" onChange={this.handleViewportPosition}/>
                    </div>
                  </div>
                </div>
            );
        }
    }
}

export default App;