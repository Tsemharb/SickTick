var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Clock from './Clock.js';
import Graph from './Graph.js';

function App() {
  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      patient = _React$useState2[0],
      setPatient = _React$useState2[1];

  var location = window.location.href.split("_");
  var patient_id = location[location.length - 1];

  React.useEffect(function () {
    fetch("http://localhost:5000/thesis/patient/data/" + patient_id).then(function (response) {
      return response.json().then(function (data) {
        setPatient(data.patients);
      });
    });
  }, []);

  console.log(patient.length);
  console.log(patient);

  return React.createElement(
    'div',
    null,
    React.createElement(Clock, null),
    React.createElement('hr', null),
    React.createElement(
      'div',
      { className: 'app' },
      React.createElement(
        'div',
        { className: 'app__graph' },
        patient.length ? React.createElement(Graph, { patients: patient }) : null
      ),
      React.createElement(
        'div',
        { className: 'app__control-panel' },
        'Insert your control panel here'
      )
    )
  );
}

export default App;