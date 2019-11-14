class General_info extends React.Component {
  render(){
      return(
        <div className = 'container'>
          <div className = 'row'>
            <div className='general_info'>
              <h2> {this.props.info.general_info.name} </h2>
              <p> <b>Адрес: </b> {this.props.info.general_info.address} </p>
              <p> <b>Дата рождения: </b> {this.props.info.general_info.birthdate} </p>
              <p> <b>Дата поступления: </b> {this.props.info.general_info.admission_date} </p>
              <p> <b>Дата выписки: </b> {this.props.info.general_info.discharge_date} </p>
              <p> <b>Отделение: </b> {this.props.info.general_info.department} </p>
              <p> <b>Диагноз: </b> {this.props.info.general_info.diagnosis} </p>
            </div>
          </div>
        </div>
      )
  }
}

export default General_info;
