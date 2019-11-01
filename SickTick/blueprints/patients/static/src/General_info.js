class General_info extends React.Component {
  render(){
      return(
          <div className='general_info'>
            <h2> {this.props.info.general_info.name} </h2>
            <p> {this.props.info.general_info.address} </p>
            <p> {this.props.info.general_info.birthdate} </p>
            <p> {this.props.info.general_info.admission_date} </p>
            <p> {this.props.info.general_info.discharge_date} </p>
            <p> {this.props.info.general_info.department} </p>
            <p> {this.props.info.general_info.diagnosis} </p>
          </div>
      )
  }
}

export default General_info;
