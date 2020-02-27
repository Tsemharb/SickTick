import Clock from './Clock.js'
import Graph from './Graph.js'
import General_info from './General_info.js'
import Temp_controller from './controller_components/Temp_controller.js'
import Ab_controller from './controller_components/Ab_controller.js'
import CBC_controller from './controller_components/CBC_controller.js'
import Add_tests_controller from './controller_components/Add_tests_controller.js'
import path from './path.js'

const { DragDropContext } = window.ReactBeautifulDnd;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            drawGraph: false,
            update: true,
            patient: {}
        };
    }


    componentDidMount() {
        let location = window.location.href;
        let patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id
        fetch(path + patient_id)
            .then(response => response.json()
                .then(data => {
                    this.setState({
                        isLoaded: true,
                        drawGraph: false,
                        update: true,
                        drawTemp: { curve: true, dots: true, labels: true },
                        drawAb: true,
                        drawCBC: true,
                        adjustAbScope: true,
                        draw_annotations: true,
                        patient: data,
                        unique_antibiotics_order: Array.from(new Set(data.antibiotics.map(item => item.name)))
                    });
                })
            );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.update;
    }



    toggleTemp = e => {
        let drawTemp = this.state.drawTemp;
        switch (e.target.id) {
            case "showTemp":
                drawTemp.curve = !drawTemp.curve;
                break;
            case "showDots":
                drawTemp.dots = !drawTemp.dots;
                break;
            case "showLabels":
                drawTemp.labels = !drawTemp.labels;
        }
        this.setState({ drawTemp: drawTemp, update: true })
    }


    toggleAb = () => this.setState({ drawAb: !this.state.drawAb, update: true })

    toggleSingleAb = e => {
        // console.log(this.state.patient.antibiotics);
        let data = this.state.patient;
        for (let i = 0; i < data.antibiotics.length; i++) {
            if (data.antibiotics[i].name == e.target.id) {
                data.antibiotics[i].draw = e.target.checked
            }
        }
        this.setState({ patient: data, update: true })
    }

    toggleAbScope = () => this.setState({ adjustAbScope: !this.state.adjustAbScope, update: true })

    setAbAbbrev = e => {
        let data = this.state.patient;
        for (let i = 0; i < data.antibiotics.length; i++) {
            if (data.antibiotics[i].name == e.target.id) {
                data.antibiotics[i].abbrev = e.target.value
            }
        }
        this.setState({ patient: data, update: true })
    }

    onDragEnd = result => {
        const {source, destination, draggableId} = result;

        if(!destination){
            return;
        }

        if(
            destination.droppableId === source.droppableId && 
            destination.index === source.index
          ){
            return;
        }

        let new_order = this.state.unique_antibiotics_order;
        new_order.splice(source.index, 1);
        new_order.splice(destination.index, 0, draggableId);
        this.setState({unique_antibiotics_order: new_order, update: true })
    }


    toggleCBC = () => this.setState({ drawCBC: !this.state.drawCBC, update: true })
    toggleCBCComponent = () => console.log('toggle')

    // edit additional test result
    updateAdditionalTestResult = (id, updatedResult) => {
        let data = this.state.patient
        for (let [key, value] of Object.entries(data.additional_tests)) {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id === id) {
                    data.additional_tests[key][i].result = updatedResult
                    this.setState({ patient: data, update: true })
                }
            }
        }
    }

    toggleSingleAddTest = e => {
        let data = this.state.patient;
        for (let [key, value] of Object.entries(data.additional_tests)) {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id + "-checkbox" === e.target.id) {
                    data.additional_tests[key][i].draw = e.target.checked
                    this.setState({ patient: data, update: true })
                }
            }
        }
    }

    handleViewportPosition = (e) => {
        e.target.id === 'viewport_x1' ?
            this.setState({ viewport_start_timestamp: parseInt(e.target.value), update: false }) :
            this.setState({ viewport_end_timestamp: parseInt(e.target.value), update: false })
    }

    // set new coordinates for annotation so that on rerender it will take up relevant position
    updateAnnotationCoords = () => {
        const add_tests_keys = Object.keys(this.state.patient.additional_tests);
        const id = document.querySelector('#annotation-id').value;
        const x = parseInt(document.querySelector('#annotation-x').value);
        const y = parseInt(document.querySelector('#annotation-y').value);
        const dx = parseInt(document.querySelector('#annotation-dx').value);
        const dy = parseInt(document.querySelector('#annotation-dy').value);
        const width = parseFloat(document.querySelector('#www').value);
        const timestamp = ((x - 80 - 0) * (this.state.viewport_end_timestamp - this.state.viewport_start_timestamp) /
            (width - 0) + this.state.viewport_start_timestamp);
        let data = this.state.patient;
        for (let [key, value] of Object.entries(data.additional_tests)) {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id === id) {
                    data.additional_tests[key][i].timestamp = timestamp;
                    data.additional_tests[key][i].y = y;
                    data.additional_tests[key][i].dx = dx;
                    data.additional_tests[key][i].dy = dy;
                    this.setState({ patient: data, update: false })
                }
            }
        }
    }


    render() {
        const {isLoaded, drawGraph, drawTemp, drawAb, patient, viewport_start_timestamp, 
               viewport_end_timestamp, draw_annotations, unique_antibiotics_order, adjustAbScope } = this.state;

        if (!isLoaded) {
            return <div> loading... </div>;
        } else if (patient.is_error) {
            return (
                <div>
                {patient.errors.map(error => {
                  return (
                    <div>{error}</div>
                  )
                })}
              </div>
            );
        } else {
            return (
                <div>
                  <Clock />
                  <hr/>
                  <General_info info={patient}/>
                  <div className='app'>
                    <div className='app__graph'>
                      <Graph graphData={{patient, drawTemp, drawAb, adjustAbScope, viewport_start_timestamp, viewport_end_timestamp,
                                         draw_annotations, unique_antibiotics_order}} />
                    </div>
                    <div className="app__control-panel">
                      {isLoaded ? <div>
                                    <Temp_controller temp = {patient.temperature}
                                                     drawTemp = {this.state.drawTemp}
                                                     toggleTemp = {this.toggleTemp} />
                                    <CBC_controller cbc_results = {patient.cbc}
                                                    drawCBC = {this.state.drawCBC}
                                                    toggleCBC = {this.toggleCBC}
                                                    toggleCBCComponent = {this.toggleCBCComponent} />
                                    {/*<DragDropContext onDragEnd={this.onDragEnd}>
                                        {this.state.init_data.columnOrder.map(columnId => {
                                            const column = this.state.init_data.columns[columnId];
                                            const tasks = column.taskIds.map(taskId => this.state.init_data.tasks[taskId]);
                                        return <Column key={column.id} column={column} tasks={tasks} />;
                                        })}
                                    </DragDropContext>*/}
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <Ab_controller antibiotics = {patient.antibiotics}
                                                       unique_ab_order = {this.state.unique_antibiotics_order}
                                                       drawAb = {this.state.drawAb}
                                                       adjustAbScope = {this.state.adjustAbScope}
                                                       toggleAbScope = {this.toggleAbScope}
                                                       toggleAb = {this.toggleAb}
                                                       toggleSingleAb = {this.toggleSingleAb}
                                                       setAbAbbrev = {this.setAbAbbrev} />
                                    </DragDropContext>
                                    <Add_tests_controller additional_tests = {patient.additional_tests}
                                                          updateAdditionalTestResult = {this.updateAdditionalTestResult}
                                                          toggleSingleAddTest = {this.toggleSingleAddTest} />
                                  </div>
                                : null}
                    </div>
                    <div className="data-from-graph">
                      <input id="viewport_x1"type="text" pattern="[0-9]*" onChange={this.handleViewportPosition}/>
                      <input id="viewport_x2"type="text" pattern="[0-9]*" onChange={this.handleViewportPosition}/>
                      <input id="annotation-id" type="text"/>
                      <input id="annotation-x" type="text" pattern="[0-9]*"/>
                      <input id="annotation-y" type="text" pattern="[0-9]*"/>
                      <input id="annotation-dx" type="text" pattern="[0-9]*"/>
                      <input id="annotation-dy" type="text" pattern="[0-9]*"/>
                      <input id="www" type="text" pattern="[0-9]*"/>
                      <button id="annotation-button" onMouseUp={this.updateAnnotationCoords}></button>
                    </div>
                  </div>
                </div>
            );
        }
    }
}

export default App;