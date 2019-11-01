import Clock from './Clock.js'
import Graph from './Graph.js'
import General_info from './General_info.js'
import Temp_controller from './Temp_controller.js'
import path from './path.js'

// function App() {
class App extends React.Component {

    constructor(props) {
        super(props);
        let location = window.location.href;
        let patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id
        this.state = {
            isLoaded: false,
            drawGraph: false,
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
                        patient: data
                    });
                })
            );
    }
    onDraw = () => this.setState({ drawGraph: true });

    render() {
        let { isLoaded, drawGraph, patient } = this.state;
        // let r = Object.values(patient.temperature);
        if (!isLoaded) {
            return <div> loading </div>;
        } else {
            // console.log(drawGraph);
            return (
                <div>
      <Clock />
      <hr/>
      <General_info info={patient}/>
      <div className='app'>
        <div className='app__graph'>
          {drawGraph ? <Graph patient={patient} /> : null}
        </div>
        <div className="app__control-panel">
          {isLoaded ? <Temp_controller temp={patient.temperature} /> : null}
          <button onClick={this.onDraw}> plot </button>
        </div>
      </div>
    </div>);
        }
    }
}

export default App;