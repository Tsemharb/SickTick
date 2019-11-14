class Ab_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    onPanelToggle = () => this.setState({ open: !this.state.open });

    render() {
        const antibiotics = this.props.antibiotics
        let renderedAb = []
        return (
            <div className="panel">
                <div className="panel-header">
                    <h6>Antibiotics</h6>
                    <button className="panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open? 'hide' : 'show'}
                    </button>
                </div>
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} > 
                    <input type="checkbox" checked={this.props.drawAb ? "checked" : null} 
                                     onChange={this.props.toggleAb}/> show antibiotics
                    {this.props.drawAb ? <div className="abList">
                                       {antibiotics.map(ab =>{
                                         if(!renderedAb.includes(ab.name)){
                                            renderedAb.push(ab.name);
                                            return(
                                              <div>
                                                <input id={ab.name} type="checkbox" checked={ab.draw ? "checked" : null}
                                                   onChange={this.props.toggleSingleAb}/>
                                                <span>{ab.name}</span>
                                              </div>
                                            )
                                          }
                                         })}
                                         </div>
                                       : null}
                </div>
            </div>
        )
    }
}

export default Ab_controller;