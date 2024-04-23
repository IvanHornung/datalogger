const db = firebase.firestore();


function addData() {
    const inputBox = document.getElementById('data-point');
    const dataPointValue  = parseFloat(dataPointInput.value.trim());
    if (!isNaN(dataPointValue)) { // Ensure the input is a number
        db.collection("dataPoints").add({
            value: dataPointValue,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Adds a timestamp
        })
        .then(function() {
            console.log("Data point added to Firestore successfully!");
            dataPointInput.value = ''; // Clear the input box
            getData(); // Optionally refresh the graph or data view
        })
        .catch(function(error) {
            console.error("Error adding data point to Firestore: ", error);
        });
    } else {
        alert("Please enter a valid number");
    }
}

function setupEventListeners() {
    const inputBox = document.getElementById('data-point');
    inputBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addData(); // Call addData when Enter is pressed
        }
    });

    const addButton = document.querySelector('button');
    addButton.onclick = addData; // Assign addData to the button's onclick event
}

function getData() {
    db.collection("dataPoints").orderBy("timestamp").get().then((querySnapshot) => {
        const dataPoints = querySnapshot.docs.map(doc => doc.data().value);
        Plotly.newPlot('graph', [{
            y: dataPoints,
            type: 'scatter'
        }], {
            margin: { t: 0 }
        });
    });
}

// Initialize the event listeners when the window loads
window.onload = function() {
    setupEventListeners();
    getData(); // Load existing data and plot it initially
};