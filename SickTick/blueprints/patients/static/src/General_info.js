class General_info extends React.Component {
  render(){
      return(
          <div className='general_info'>
          <p> {this.props.info.name} </p>  
          <p> {this.props.info.address} </p>  
          <p> {this.props.info.birthdate} </p>  
          <p> {this.props.info.admission_date} </p>  
          <p> {this.props.info.discharge_date} </p>  
          <p> {this.props.info.department} </p>  
          <p> {this.props.info.diagnosis} </p>  
          </div>
      )
  }
}

export default General_info;
