let dataPoints = [];

// Load stored data
window.onload = function() {
    if (localStorage.getItem("savedData")) {
        dataPoints = JSON.parse(localStorage.getItem("savedData"));
        updateGraph();
    }
};

function addData() {
    const inputBox = document.getElementById('data-point');
    const newData = parseFloat(inputBox.value);
    if (!isNaN(newData)) {
        dataPoints.push(newData);
        localStorage.setItem("savedData", JSON.stringify(dataPoints));
        updateGraph();
        inputBox.value = '';
    }
}

function updateGraph() {
    Plotly.newPlot('graph', [{
        y: dataPoints,
        type: 'scatter'
    }], {
        margin: { t: 0 }
    });
}
