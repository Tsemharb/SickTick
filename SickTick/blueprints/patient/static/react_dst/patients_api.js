// class Patients_api extends React.Component{
//   render(){
//     return(
//       <div> test patients </div>
//     );
//   }
// }

function Patients_api() {
  React.useEffect(function () {
    fetch("http://localhost:5000/test/patient").then(function (response) {
      return (
        // fetch("https://api.randomuser.me/").then(response =>
        response.json().then(function (data) {
          console.log(data);
        })
      );
    });
  }, []);
  return React.createElement("div", { className: "Patients_api" });
}

export default Patients_api;