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
        {patient.length ? <Graph patients={patient}/> : null}
      </div>
    );
  }



export default App;
