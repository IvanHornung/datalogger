const db = firebase.firestore();


// function submitClashRoyaleData() {
//     const winsInput = document.getElementById('clash-royale-wins');
//     const wins = parseInt(winsInput.value, 10);
//     const clashRoyaleDocRef = db.collection("ClashRoyale").doc("classicChallengeWins");

    
//     if (!isNaN(wins) && wins >= 0 && wins <= 12) {
//         db.runTransaction(transaction => {
//             return transaction.get(clashRoyaleDocRef).then(doc => {
//                 if (!doc.exists) {
//                     throw "Document does not exist!";
//                 }
                
//                 // Get the current array data or initialize if not present
//                 const currentWins = doc.data().wins || [];
//                 const currentTimestamps = doc.data().timestamps || [];
                
//                 // Append the new win and the corresponding timestamp
//                 currentWins.push(wins);
//                 currentTimestamps.push(firebase.firestore.FieldValue.serverTimestamp());

//                 // Update the document arrays
//                 transaction.update(clashRoyaleDocRef, {
//                     wins: currentWins,
//                     timestamps: currentTimestamps
//                 });
//             });
//         }).then(() => {
//             console.log("Clash Royale wins updated successfully!");
//             winsInput.value = ''; // Clear the input box after submitting
//         }).catch(error => {
//             console.error("Error updating Clash Royale wins: ", error);
//         });
//     } else {
//         alert("Please enter a valid number of wins");
//     }
// }
function submitClashRoyaleData() {
    const winsInput = document.getElementById('clash-royale-wins');
    const wins = parseInt(winsInput.value, 10);

    if (!isNaN(wins) && wins >= 0 && wins <= 12) {
        const clashRoyaleDocRef = db.collection("ClashRoyale").doc("classicChallengeWins");

        db.runTransaction(transaction => {
            return transaction.get(clashRoyaleDocRef).then(doc => {
                if (!doc.exists) {
                    console.log("Document does not exist, creating a new one");
                    transaction.set(clashRoyaleDocRef, { wins: [wins], timestamps: [firebase.firestore.FieldValue.serverTimestamp()] });
                } else {
                    console.log("Document exists, updating arrays");
                    const currentWins = doc.data().wins || [];
                    const currentTimestamps = doc.data().timestamps || [];

                    currentWins.push(wins);
                    currentTimestamps.push(firebase.firestore.FieldValue.serverTimestamp());

                    transaction.update(clashRoyaleDocRef, {
                        wins: currentWins,
                        timestamps: currentTimestamps
                    });
                }
            });
        }).then(() => {
            console.log("Transaction successfully committed!");
            winsInput.value = ''; // Clear the input box after submitting
        }).catch(error => {
            console.error("Transaction failed: ", error);
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
function plotClassicChallengeWinsData() {
    const clashRoyaleDocRef = db.collection("ClashRoyale").doc("classicChallengeWins");

    clashRoyaleDocRef.get().then(doc => {
        if (doc.exists) {
            const winsData = doc.data().wins || [];
            const timestampsData = doc.data().timestamps || [];

            // Create the plot
            var trace = {
                x: timestampsData.map((_, index) => index), // Array of indices
                y: winsData, // Array of wins
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' }
            };

            var layout = {
                title: 'Clash Royale Classic Challenge Wins',
                xaxis: {
                    title: 'Index' // No units, just the index
                },
                yaxis: {
                    title: 'Wins',
                    range: [0, 12] // Setting the range from 0 to 12
                }
            };

            Plotly.newPlot('myPlotDiv', [trace], layout);
        } else {
            console.log("No such document!");
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