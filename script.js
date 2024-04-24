const db = firebase.firestore();


// pushes clash royale win data to firebase db
function submitClashRoyaleData() {
    const winsInput = document.getElementById('clash-royale-wins');
    const wins = parseInt(winsInput.value, 10); // Ensure the input is an integer
    if (!isNaN(wins) && wins >= 0 && wins <= 12) { // Check if the input is a number and non-negative
        db.collection("ClashRoyale").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            wins: wins
        })
        .then(function(docRef) {
            console.log("Clash Royale wins added with ID: ", docRef.id);
            winsInput.value = ''; // Clear the input box after submitting
        })
        .catch(function(error) {
            console.error("Error adding Clash Royale wins: ", error);
        });
    } else {
        alert("Please enter a valid number of wins");
    }
}

// listens to events and acts according to ID, defined in HTML tag
// necessary practice in js for multiple listeners
function setupEventListeners() {
    const winsInput = document.getElementById('clash-royale-wins');
    winsInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitClashRoyaleData(); // Call submitClashRoyaleData when Enter is pressed
        }
    });

    // Assuming your button has an id of 'submit-button'
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', submitClashRoyaleData);
}

// go through the data and plot
function getClashRoyaleDataAndPlot() {
    db.collection("ClashRoyale").orderBy("timestamp")
        .get()
        .then(function(querySnapshot) {
            const timestamps = [];
            const wins = [];
            
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                timestamps.push(new Date(doc.data().timestamp.toDate()));
                wins.push(doc.data().wins);
            });
            
            plotClassicChallengeWinData(timestamps, wins);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function plotClassicChallengeWinData(timestamps, wins) {
    var trace = {
        type: "scatter",  // Use a line plot
        mode: "lines+markers",  // Line plot with markers at each data point
        x: timestamps,
        y: wins,
        marker: {color: 'blue'}  // Color of the markers
    };

    var layout = {
        title: 'Clash Royale Classic Challenge Wins Over Time',
        xaxis: {
            title: 'Date and Time',
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'Wins',
            showline: false
        }
    };

    var data = [trace];

    Plotly.newPlot('myDiv', data, layout);  // Assuming you have a <div> with id='myDiv' for the plot
}








// Initialize the event listeners when the window loads
// you need to set up event listeners and render the plot when loading the page
window.onload = function() {
    setupEventListeners();
    getClashRoyaleDataAndPlot(); // Load existing data and plot it initially
};