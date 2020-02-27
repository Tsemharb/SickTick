const { Draggable, Droppable } = window.ReactBeautifulDnd;

class Ab_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    onPanelToggle = () => this.setState({ open: !this.state.open });

    setAbAbbrev = () => {console.log('sdfsdf')}

    render() {
        const antibiotics = this.props.antibiotics;
        const ab_order = this.props.unique_ab_order;
        // console.log(antibiotics);
        return (
            <div className="panel">
                <div className="panel-header">
                    <h6>Antibiotics</h6>
                    <button className="toggle-button panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open? 'hide' : 'show'}
                    </button>
                </div>
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} >
                  <div className={"panel-settings"}>
                      <span>
                        <input type="checkbox" checked={this.props.drawAb ? "checked" : null} 
                                       onChange={this.props.toggleAb}/> show antibiotics
                      </span>
                      <span>
                        <input type="checkbox" checked={this.props.adjustAbScope ? "checked" : null} 
                                       onChange={this.props.toggleAbScope}/> hide AB outside selected scope
                      </span>
                  </div>
                  {this.props.drawAb ? 
                    <div className="ab-list-wrapper">
                      <h6> Antibiotics list</h6>
                      <Droppable droppableId={'antibiotics'}>
                        {provided => (
                          <div className="panel-parameters"
                               ref={provided.innerRef} 
                               {...provided.droppableProps}
                               >
                              { ab_order.map((next_ab, ind) => {
                                // console.log(ab_order);
                                let ab = null;
                                for (let [key, value] of Object.entries(antibiotics)){
                                  if (value.name === next_ab){
                                    ab = value;
                                    ab.index = ind;
                                    break;
                                  }
                                };
                                return (
                                <Draggable key={ab.name+ab.index} draggableId={ab.name} index={ab.index}>
                                  {provided => (
                                    <div className="ab-item"
                                         ref={provided.innerRef}
                                             {...provided.draggableProps}
                                             {...provided.dragHandleProps}>
                                      <div>
                                        <input id={ab.name} type="checkbox" checked={ab.draw ? "checked" : null}
                                               onChange={this.props.toggleSingleAb}/>
                                        <span> {ab.name} </span>
                                      </div>
                                      <input type="text" id={ab.name} value={ab.abbrev}
                                             onChange={(evt) => this.props.setAbAbbrev(evt)}/>
                                    </div>
                                  )}
                                </Draggable>)}
                              )}
                              {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  : null}
                </div>
            </div>
        )
    }
}

export default Ab_controller;