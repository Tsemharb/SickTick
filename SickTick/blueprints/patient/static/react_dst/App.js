var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Clock from './Clock.js';
//import Patients_api from './patients_api.js'
import Graph from './Graph.js';

function App() {
  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      patients = _React$useState2[0],
      setPatients = _React$useState2[1];

  React.useEffect(function () {
    fetch("http://localhost:5000/thesis/patient").then(function (response) {
      return (
        // fetch("https://api.randomuser.me/").then(response =>
        response.json().then(function (data) {
          setPatients(data.patients);
        })
      );
    });
  }, []);

  return React.createElement(
    'div',
    null,
    React.createElement(Clock, null),
    React.createElement('hr', null),
    patients.length ? React.createElement(Graph, { patients: patients }) : null
  );
}

export default App;