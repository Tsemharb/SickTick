class Ab_controller extends React.Component {

    render() {
        const antibiotics = this.props.antibiotics
        // const ans = Array.from(new Set(this.props.antibiotics.map(ab => {name: ab.name, draw: ab.draw})));
        let renderedAb = []
        return (
            <div>
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
        )
    }
}

export default Ab_controller;