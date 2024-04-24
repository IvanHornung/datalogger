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

            // Create the plot
            var trace = {
                x: indices, // Array of indices as the x-axis
                y: winsData, // Array of wins as the y-axis
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' }
            };

            var layout = {
                title: 'Clash Royale Classic Challenge Wins',
                xaxis: {
                    title: 'Attempt Number' // x-axis title
                },
                yaxis: {
                    title: 'Wins',
                    range: [0, 12] // y-axis range from 0 to 12
                }
            };

            Plotly.newPlot('myPlotDiv', [trace], layout);
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