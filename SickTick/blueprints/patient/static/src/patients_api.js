
function Patients_api(){
  React.useEffect(() => {
    fetch("http://localhost:5000/thesis/patient").then(response =>
      // fetch("https://api.randomuser.me/").then(response =>
      response.json().then(data => {
        console.log(data['patients'][0]['name']);
      })
    );
  }, []);
  return <div className="Patients_api">
          </div>;
}

export default Patients_api;
