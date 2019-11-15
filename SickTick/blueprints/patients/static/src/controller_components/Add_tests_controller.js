class Add_tests_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    // hide all additional test tab
    componentWillMount() {
        const keys = Object.keys(this.props.additional_tests);
        let test_info_tab_open = {};
        keys.map(key => test_info_tab_open[key] = false);
        this.setState({ test_info_tab_open: test_info_tab_open })
    }

    componentDidMount() {
        const averageNumOfSymbolsInTextareaString = 44;
        const textareas = document.getElementsByClassName('test-result');
        for (let textarea of textareas) {
            textarea.rows = Math.ceil(textarea.value.length / averageNumOfSymbolsInTextareaString);
        }
    }

    onPanelToggle = () => this.setState({ open: !this.state.open })

    toggleTest = e => {
        let toggle_state = this.state.test_info_tab_open;
        toggle_state[e.target.id] = !toggle_state[e.target.id];
        this.setState({ test_info_tab_open: toggle_state });
    }

    // set matching textarea height
    handleTextareaChange = e => {
        const textareaLineHeight = 12;
        const previousRows = e.target.rows;
        e.target.rows = 1;
        const currentRows = Math.floor((e.target.scrollHeight) / textareaLineHeight);
        e.target.rows = currentRows;
    };

    render() {
        const tests = this.props.additional_tests;
        const keys = Object.keys(this.props.additional_tests);
        return (
            <div className="panel">
                <div className="panel-header">
                    <h6>Additional Tests</h6>
                    <button className="toggle-button panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open? 'hide' : 'show'}
                    </button>
                </div>
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} >
                  {keys.map(key => 
                    <div className="test-group-wrapper">
                        <div className="test-group-header">
                            <p className="test-group-title"> {key} </p>
                            <button id={key} className="toggle-button test-toggle" onClick = {this.toggleTest}>
                                {!this.state.test_info_tab_open[key] ? "+": "-"} 
                            </button>
                        </div>
                        <div className = "test-group">
                          {tests[key].map(test => 
                            <div className="test-info" style={!this.state.test_info_tab_open[key] ? {display: "none"}: null}>
                                <span>{test.date}</span>
                                <textarea class="test-result" onChange={this.handleTextareaChange}>{test.result}</textarea>
                            </div>
                            )
                          }
                        </div>
                    </div> )
                  }
                </div>
            </div>
        )
    }
}

export default Add_tests_controller;