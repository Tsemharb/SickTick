import Clock from './Clock.js'
import Graph from './Graph.js'


function App() {

  const [patient, setPatient] = React.useState([]);
  let location = window.location.href.split("_");
  let patient_id = (location[location.length-1]);

  React.useEffect(() => {
    fetch("http://localhost:5000/thesis/patient/data/" + patient_id)
    .then(response => response.json()
    .then(data => {
        setPatient(data.patients);
      })
    );
  }, []);

console.log(patient.length);
console.log(patient);

  return (
    <div>
      <Clock />
      <hr/>
      <div className='app'>
        <div className='app__graph'>
          {patient.length ? <Graph patients={patient}/> : null}
        </div>
        <div className="app__control-panel">
          Insert your control panel here
        </div>
      </div>
    </div>
  );
}



export default App;
