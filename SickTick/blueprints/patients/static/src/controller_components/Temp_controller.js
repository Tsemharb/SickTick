class Temp_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    onPanelToggle = () => this.setState({ open: !this.state.open });

    render() {
        let temp = Object.values(this.props.temp);
        return (
            <div className="panel">
                <div className="panel-header">
                    <h6>Temperature</h6> 
                    <button className="toggle-button panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open ? 'hide' : 'show'}
                    </button>
                </div> 
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} >
                  <input id="showTemp" type="checkbox" checked={this.props.drawTemp.curve ? "checked" : null} 
                                       onChange={this.props.toggleTemp}/> show temperature
                  {this.props.drawTemp.curve ? <div className="panel-parameters">
                                                 <div>
                                                    <input id="showDots" type="checkbox" checked={this.props.drawTemp.dots ? "checked" : null}
                                                           onChange={this.props.toggleTemp}/> temperature dots
                                                 </div>
                                                 <div>
                                                    <input id="showLabels" type="checkbox" checked={this.props.drawTemp.labels ? "checked" : null}
                                                           onChange={this.props.toggleTemp}/> temperature labels</div>
                                               </div> 
                                            : null}
                </div>
            </div>
        )
    }
}

export default Temp_controller;