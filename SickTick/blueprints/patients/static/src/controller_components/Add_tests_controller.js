class Add_tests_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    // hide all additional test tab and display settings
    componentWillMount() {
        const keys = Object.keys(this.props.additional_tests);
        const tests = this.props.additional_tests;
        let test_info_tab_open = {};
        let test_display_settings_open = {};
        keys.map(key => test_info_tab_open[key] = false);
        keys.map(key => {tests[key].map(test => test_display_settings_open[test.id] = false)});
        this.setState({ test_info_tab_open: test_info_tab_open, test_display_settings_open: test_display_settings_open });
    }

    // set roughly estimated textarea size for each test result
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

    toggleSettingsDisplay = e =>{
        console.log('panel-header')
        let toggle_state = this.state.test_display_settings_open;
        toggle_state[e.target.id] = !toggle_state[e.target.id];
        this.setState({ test_display_settings_open: toggle_state });
    }

    // set matching textarea height
    handleTextareaChange = e => {
        const textareaLineHeight = 12;
        const previousRows = e.target.rows;
        e.target.rows = 1;
        const currentRows = Math.floor((e.target.scrollHeight) / textareaLineHeight);
        e.target.rows = currentRows;
        this.props.updateAdditionalTestResult(e.target.id, e.target.value);
    }

    togglePalette = (e) =>{
        console.log(this.state.showPalette);
        if (this.state.showPalette === e.target.id){
            this.setState({showPalette: null})
        }
        else
            this.setState({showPalette: e.target.id});
    }

    render() {
        const tests = this.props.additional_tests;
        const keys = Object.keys(this.props.additional_tests);
        console.log(tests);
        return (
            <div className="panel additional-tests-panel">
                <div className="panel-header">
                    <h6>Additional Tests</h6>
                    <button className="toggle-button panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open? 'hide' : 'show'}
                    </button>
                </div>
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} >
                  {keys.map(key => 
                    <div className="test-group-wrapper">
                        <div id={key} className="test-group-header" onClick = {this.toggleTest}>
                            <p className="test-group-title"> {key} </p>
                            <p> {!this.state.test_info_tab_open[key] ? "+": "-"} </p>
                        </div>
                        <div className = "test-group">
                          {tests[key].map(test => 
                            <div className="test-info" style={!this.state.test_info_tab_open[key] ? {display: "none"}: null}>
                                <div className="test-info-header">
                                    <div> 
                                        <input id={test.id + "-checkbox"}type="checkbox" checked={test.draw ? "checked" : null} 
                                               onChange={this.props.toggleSingleAddTest}/>
                                        <span>{test.date}</span>
                                    </div>
                                </div>
                                <textarea id={test.id} class="test-result" onChange={this.handleTextareaChange}>{test.result}</textarea>
                                <div>
                                    <div className="test-settings-buttons">
                                        <button id={test.id} onClick = {this.toggleSettingsDisplay} style={!test.draw ? {visibility: "hidden"}: null}> 
                                            {!this.state.test_display_settings_open[test.id] ? 'display settings': 'hide settings'}
                                        </button>
                                        <button id={test.id + "-reset"} onClick = {this.props.resetInitialTestPosition}> reset initial position </button>
                                    </div>
                                    <div className="test-settings" style={!this.state.test_display_settings_open[test.id] || !test.draw ? {display: "none"}: null}>
                                        <div className="settings-row"> 
                                            <span>title font-size</span>
                                            <button id={test.id + "-decrease-title-font"} onClick = {this.props.decreaseTitleFontSize}>-</button>
                                            <span>{test.title_font_size}</span>
                                            <button id={test.id + "-increase-title-font"} onClick = {this.props.increaseTitleFontSize}>+</button>
                                        </div>
                                        <div className="settings-row">
                                            <div>title font color</div>
                                            <div id={test.id + "-title-color"} className='current-color' style={{background: test.title_color}} onClick = {this.togglePalette}></div>
                                            <div className='color-palette' style={this.state.showPalette === test.id + "-title-color" ? {display: "flex"}: null}>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"red"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"blue"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"green"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"pink"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"wheat"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"coral"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"black"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"yellow"}} onClick = {this.props.setTitleColor}></div>
                                                <div id={test.id + "-title-color"} className='color' style={{background:"whitesmoke"}} onClick = {this.props.setTitleColor}></div>
                                            </div>
                                        </div>
                                        <div className="settings-row"> 
                                            <span>result font-size</span>
                                            <button id={test.id + "-decrease-result-font"} onClick = {this.props.decreaseResultFontSize}>-</button>
                                            <span>{test.result_font_size}</span>
                                            <button id={test.id + "-increase-result-font"} onClick = {this.props.increaseResultFontSize}>+</button>
                                        </div>
                                        <div className="settings-row">
                                            <div>result font color</div>
                                            <div id={test.id + "-result-text-color"} className='current-color' style={{background: test.result_color}} onClick = {this.togglePalette}></div>
                                            <div className='color-palette' style={this.state.showPalette === test.id + "-result-text-color" ? {display: "flex"}: null}>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"red"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"blue"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"green"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"pink"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"wheat"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"coral"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"black"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"yellow"}} onClick = {this.props.setResultTextColor}></div>
                                                <div id={test.id + "-result-text-color"} className='color' style={{background:"whitesmoke"}} onClick = {this.props.setResultTextColor}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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