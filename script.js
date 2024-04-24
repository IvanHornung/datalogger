const db = firebase.firestore();


function submitClashRoyaleData() {
    const winsInput = document.getElementById('clash-royale-wins');
    const wins = parseInt(winsInput.value, 10); // Ensure the input is an integer

    // Check if the input is a number and non-negative, within the range of 0 to 12
    if (!isNaN(wins) && wins >= 0 && wins <= 12) {
        const clashRoyaleDocRef = db.collection("ClashRoyale").doc("classicChallengeWins");

        // Convert current date and time to a string
        const nowAsString = new Date().toISOString();

        db.runTransaction(transaction => {
            return transaction.get(clashRoyaleDocRef).then(doc => {
                if (!doc.exists) {
                    // If the document does not exist, create it with the initial values
                    transaction.set(clashRoyaleDocRef, {
                        wins: [wins],
                        timestamps: [nowAsString] // Store the string representation of the timestamp
                    });
                } else {
                    // If the document exists, append the new win and timestamp string
                    const currentWins = doc.data().wins || [];
                    const currentTimestamps = doc.data().timestamps || [];

                    currentWins.push(wins);
                    currentTimestamps.push(nowAsString); // Add the string timestamp

                    transaction.update(clashRoyaleDocRef, {
                        wins: currentWins,
                        timestamps: currentTimestamps
                    });
                }
            });
        }).then(() => {
            console.log("Clash Royale wins updated successfully!");
            winsInput.value = ''; // Clear the input box after submitting
        }).catch(error => {
            console.error("Error updating Clash Royale wins: ", error);
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


function plotClassicChallengeWinsData() {
    const clashRoyaleDocRef = db.collection("ClashRoyale").doc("classicChallengeWins");

    clashRoyaleDocRef.get().then(doc => {
        if (doc.exists) {
            const winsData = doc.data().wins || [];
            const indices = winsData.map((_, index) => index); // Create an array of indices

            // Create the scatter plot trace
            var scatterTrace = {
                x: indices,
                y: winsData,
                xaxis: 'x1',  // Assign to first x-axis
                yaxis: 'y1',  // Assign to first y-axis
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                name: 'Line Plot'
            };

            // Create the histogram trace
            var histogramTrace = {
                x: winsData,
                xaxis: 'x2',  // Assign to second x-axis
                yaxis: 'y2',  // Assign to second y-axis
                type: 'histogram',
                opacity: 0.75,
                marker: {
                    color: 'green',
                },
                name: 'Histogram',
                xbins: {
                    start: 0,
                    end: 13,  // Ensure it covers the range including the upper bound
                    size: 1
                }
            };

            var data = [scatterTrace, histogramTrace];

            var layout = {
                title: 'Clash Royale Wins Data Analysis',
                grid: {rows: 1, columns: 2, subplots: [['xy', 'x2y2']]}, // Define the subplots
                xaxis: {
                    title: 'Attempt Number',
                    domain: [0, 0.45]  // Allocate domain for the first plot
                },
                yaxis: {
                    title: 'Wins',
                    range: [0, 12]
                },
                xaxis2: {
                    title: 'Wins (Histogram)',
                    domain: [0.55, 1]  // Allocate domain for the second plot
                },
                yaxis2: {
                    title: 'Count',
                    overlaying: 'y',  // Optional: Overlay y-axis if needed
                    anchor: 'x2'
                },
                barmode: 'overlay'
            };

            Plotly.newPlot('myPlotDiv', data, layout);
        } else {
            console.log("Document not found");
        }
    }).catch(error => {
        console.error("Error getting document: ", error);
    });
}


// Initialize the event listeners when the window loads
// you need to set up event listeners and render the plot when loading the page
window.onload = function() {
    setupEventListeners();
    plotClassicChallengeWinsData(); // Load existing data and plot it initially
};