class Ab_controller extends React.Component {

    render() {
        let temp = Object.values(this.props.temp);
        return (
            <div>
              <input type="checkbox" checked={this.props.drawAb ? "checked" : null} 
                                     onChange={this.props.toggleAb}/> show antibiotics
            </div>
            //temp.map(t => <small>{t.temp}</small>);
        )
    }
}

export default Ab_controller;