import Clock from './Clock.js'
//import Patients_api from './patients_api.js'
import Graph from './Graph.js'


function App() {

  const [patients, setPatients] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5000/thesis/patient").then(response =>
      // fetch("https://api.randomuser.me/").then(response =>
      response.json().then(data => {
        setPatients(data.patients);
      })
    );
  }, []);


  return (
      <div>
        <Clock />
        <hr/>
        {patients.length ? <Graph patients={patients}/> : null}
      </div>
    );
  }



export default App;
