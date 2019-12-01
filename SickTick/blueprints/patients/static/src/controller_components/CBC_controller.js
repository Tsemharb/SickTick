class CBC_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    onPanelToggle = () => this.setState({ open: !this.state.open });

    render() {
        // console.log(this.props)
        const cbcResults = this.props.cbc_results.data
        const cbcComponentsKeys = Object.keys(cbcResults)
        return (
            <div className="panel">
                <div className="panel-header">
                    <h6>Complete Blood Count</h6>
                    <button className="toggle-button panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open? 'hide' : 'show'}
                    </button>
                </div>
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} > 
                    <input type="checkbox" checked={this.props.drawCBC ? "checked" : null} 
                                     onChange={this.props.toggleCBC}/> show CBC
                    {this.props.drawCBC ? <div className="panel-parameters two-cols">
                                       {cbcComponentsKeys.map(key =>{
                                            return(
                                              <div>
                                                <input id={key} type="checkbox" checked="checked"
                                                   onChange={this.props.toggleCBCComponent}/>
                                                <span>{key}</span>
                                              </div>
                                            )

                                         })}
                                         </div>
                                       : null}
                </div>
            </div>
        )
    }
}

export default CBC_controller;