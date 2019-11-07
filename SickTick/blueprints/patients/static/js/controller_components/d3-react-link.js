var d3_react_link = function d3_react_link() {
    var viewport = document.getElementsByClassName("selection")[0];

    var x1 = document.getElementById('viewport_x1');
    var lastValue1 = x1.value;
    x1.value = parseInt(viewport.getBBox().x);
    var event1 = new Event('input', { bubbles: true });
    var tracker1 = x1._valueTracker;
    if (tracker1) {
        tracker1.setValue(lastValue1);
    }
    x1.dispatchEvent(event1);

    var x2 = document.getElementById('viewport_x2');
    var lastValue2 = x2.value;
    x2.value = parseInt(viewport.getBBox().x + viewport.getBBox().width);
    var event2 = new Event('input', { bubbles: true });
    var tracker2 = x2._valueTracker;
    if (tracker2) {
        tracker2.setValue(lastValue2);
    }
    x2.dispatchEvent(event2);
};
export default d3_react_link;