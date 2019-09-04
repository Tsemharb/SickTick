// class Patients_api extends React.Component{
//   render(){
//     return(
//       <div> test patients </div>
//     );
//   }
// }

function Patients_api(){
  React.useEffect(() => {
    fetch("http://localhost:5000/test/patient").then(response =>
      // fetch("https://api.randomuser.me/").then(response =>
      response.json().then(data => {
        console.log(data);
      })
    );
  }, []);
  return <div className="Patients_api" />;
}

export default Patients_api;
