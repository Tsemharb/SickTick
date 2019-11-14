class Add_tests_controller extends React.Component {

    constructor() {
        super();
        this.state = { open: false };
    }

    onPanelToggle = () => this.setState({ open: !this.state.open });

    render() {
        const tests = this.props.additional_tests;
        return (
            <div className="panel">
                <div className="panel-header">
                    <h6>Additional Tests</h6>
                    <button className="panel-header-btn" onClick = {this.onPanelToggle}>
                        {this.state.open? 'hide' : 'show'}
                    </button>
                </div>
                <div className={"panel-content" + (!this.state.open? " hidden" : "")} >
                  <div>
                    {tests.map(test => <p>{test.result}</p>)}
                  </div>
                </div>
            </div>
        )
    }
}

export default Add_tests_controller;