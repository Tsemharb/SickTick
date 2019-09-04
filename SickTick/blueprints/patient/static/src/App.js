import Clock from './Clock.js'
import Patients_api from './patients_api.js'

class App extends React.Component {
  render() {
    return (
      <div>
        <Clock />
        <Patients_api />
      </div>
    );
  }
}

export default App;
