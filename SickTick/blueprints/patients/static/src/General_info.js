class General_info extends React.Component {
  render(){
      return(
          <div className='general_info'>
          <p> {this.props.info.patient.general_info.name} </p>
          <p> {this.props.info.patient.general_info.address} </p>
          <p> {this.props.info.patient.general_info.birthdate} </p>
          <p> {this.props.info.patient.general_info.admission_date} </p>
          <p> {this.props.info.patient.general_info.discharge_date} </p>
          <p> {this.props.info.patient.general_info.department} </p>
          <p> {this.props.info.patient.general_info.diagnosis} </p>
          </div>
      )
  }
}

export default General_info;
