class Temp_controller extends React.Component {

    render() {
        let temp = Object.values(this.props.temp);
        return (
            <div>
              <input id="showTemp" type="checkbox" checked={this.props.drawTemp ? "checked" : null} 
                                   onChange={this.props.toggleTemp}/> show temperature
            </div>
            //temp.map(t => <small>{t.temp}</small>);
        )
    }
}

export default Temp_controller;