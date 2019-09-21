import Clock from './Clock.js'
import Graph from './Graph.js'


function App() {

  const [patient, setPatient] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5000/thesis/patient/data").then(response =>
      response.json().then(data => {
        setPatient(data.patients);
      })
    );
  }, []);


  return (
    <div>
      <Clock />
      <hr/>
      <div className='app'>
        <div className='app__graph'>
          {patient.length ? <Graph patients={patient}/> : null}
        </div>
        <div className="app__control-panel">
          test
        </div>
      </div>
    </div>
    );
  }



export default App;
