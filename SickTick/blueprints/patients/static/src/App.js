import Clock from './Clock.js'
import Graph from './Graph.js'
import General_info from './General_info.js'

function App() {

  const [patient, setPatient] = React.useState([]);
  let location = window.location.href;
  let patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id

  console.log(patient_id);

  React.useEffect(() => {
    fetch("http://localhost:5000/thesis/patient/data/" + patient_id)
    .then(response => response.json()
    .then(data => {
        setPatient(data.patient);
      })
    );
  }, []);

// console.log(Object.keys(patient).length);
// console.log(patient);

  return (
    <div>
      <Clock />
      <hr/>
      {Object.keys(patient).length ? <General_info info={patient.general_info}/> : null}
      <div className='app' style={{display: "flex", justifyContent: "center"}}>
        <div className='app__graph'>
          {Object.keys(patient).length ? <Graph patient={patient}/> : null}
        </div>
        <div className="app__control-panel">
          Insert your control panel here
        </div>
      </div>
    </div>
  );
}


export default App;
