import Clock from './Clock.js'
import Graph from './Graph.js'
import General_info from './General_info.js'

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

  componentDidMount(){
    let location = window.location.href;
    let patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id
    fetch("http://localhost:5000/thesis/patient/data/" + patient_id)
      .then(response => response.json()
      .then(data => {
        this.setState({isLoaded: true,
                       patient: data});
        })
      );
  }

  onDraw = () => this.setState({drawGraph: true});

  render () {
    let {isLoaded, drawGraph, patient} = this.state;

    if (!isLoaded){
      return <div> loading </div>;
    }
    else{
    // console.log(drawGraph);
    return(
    <div>
      <Clock />
      <hr/>
      <General_info info={patient}/>
      <div className='app' style={{display: "flex", justifyContent: "center"}}>
        <div className='app__graph'>
          {drawGraph ? <Graph patient={patient} /> : null}
        </div>
        <div className="app__control-panel">
          Insert your control panel here
        </div>
          <button onClick={this.onDraw}> plot </button>
      </div>
    </div> );
    }
  }
}

export default App;
