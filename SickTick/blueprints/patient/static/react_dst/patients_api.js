
function Patients_api() {
  React.useEffect(function () {
    fetch("http://localhost:5000/thesis/patient").then(function (response) {
      return (
        // fetch("https://api.randomuser.me/").then(response =>
        response.json().then(function (data) {
          console.log(data['patients'][0]['name']);
        })
      );
    });
  }, []);
  return React.createElement('div', { className: 'Patients_api' });
}

export default Patients_api;