class Temp_controller extends React.Component {
    render() {
      let temp = Object.values(this.props.temp);
        return temp.map(t => <small>{t.temp}</small>);
    }
}

export default Temp_controller;