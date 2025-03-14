// Code for displaying post-treatment profiles (repetition of last task)

Qualtrics.SurveyEngine.addOnload(function() {
    // Retrieve the last completed round
    let lastRound = parseInt(Qualtrics.SurveyEngine.getEmbeddedData("current_round")) - 1;
    console.log("Retrieving final round:", lastRound); // Debugging

    let profile1Name = Qualtrics.SurveyEngine.getEmbeddedData("profile1_round" + lastRound);
    let profile2Name = Qualtrics.SurveyEngine.getEmbeddedData("profile2_round" + lastRound);

    // Remove "(First candidate)" and "(Second candidate)" if already stored
    profile1Name = profile1Name.replace(" (First candidate)", "");
    profile2Name = profile2Name.replace(" (Second candidate)", "");

    // Update the table headers
    document.getElementById("profile1_name").textContent = profile1Name;
    document.getElementById("profile2_name").textContent = profile2Name;

    // Retrieve and populate attributes
    let attributeOrder = JSON.parse(Qualtrics.SurveyEngine.getEmbeddedData("attribute_order" + lastRound));

    let tableBody = document.querySelector("#conjointTable tbody");
    tableBody.innerHTML = ""; // Clear any existing content

    attributeOrder.forEach(attr => {
        let attrKey = attr.replace(/\s+/g, "_").toLowerCase(); // Convert to safe format
        
        let profile1Value = Qualtrics.SurveyEngine.getEmbeddedData("profile1_" + attrKey + "_round" + lastRound);
        let profile2Value = Qualtrics.SurveyEngine.getEmbeddedData("profile2_" + attrKey + "_round" + lastRound);

        // Create row for each attribute
        let row = document.createElement("tr");

        let labelCell = document.createElement("td");
        labelCell.textContent = attr;

        let profile1Cell = document.createElement("td");
        profile1Cell.textContent = profile1Value || "-";

        let profile2Cell = document.createElement("td");
        profile2Cell.textContent = profile2Value || "-";

        row.appendChild(labelCell);
        row.appendChild(profile1Cell);
        row.appendChild(profile2Cell);
        tableBody.appendChild(row);
    });

   	var inputBox = document.querySelector('textarea');
    if (inputBox) {
        inputBox.style.width = "750px";  // Adjust width
        inputBox.style.height = "300px"; // Adjust height
    }
	
	
});
