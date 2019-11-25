const d3_react_link = (domain_min, domain_max) => {
    const viewport = document.getElementsByClassName("selection")[0];

    const x1 = document.getElementById('viewport_x1');
    const lastValue1 = x1.value;
    x1.value = domain_min;
    let event1 = new Event('input', { bubbles: true });
    let tracker1 = x1._valueTracker;
    if (tracker1) {
        tracker1.setValue(lastValue1);
    }
    x1.dispatchEvent(event1);


    const x2 = document.getElementById('viewport_x2');
    const lastValue2 = x2.value;
    x2.value = domain_max;
    let event2 = new Event('input', { bubbles: true });
    let tracker2 = x2._valueTracker;
    if (tracker2) {
        tracker2.setValue(lastValue2);
    }
    x2.dispatchEvent(event2);
    
    const innerWidth = document.getElementsByClassName('overlay')[0].getBBox().width
    document.getElementById('www').value = innerWidth;
}
export default d3_react_link
