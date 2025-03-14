// Code for displaying main conjoint tasks

Qualtrics.SurveyEngine.addOnload(function() {

    // Arrays containing all attribute levels:
    var EducationArray = ["High school diploma", "Bachelor's degree"];  
    var GenderArray = ["Male","Female"]; // Gender is still randomized normally
    var RaceArray = ["White", "Black", "Hispanic"];
    var FamilyArray = ["No extended family live in the neighborhood", "Some extended family live in the neighborhood", "Most extended family live in the neighborhood"];
    var ResidenceLengthArray = ["Just moved to the neighborhood", "Lived in the neighborhood for 5 years", "Lived in the neighborhood for 20 years"]; 
    var BirthArray = ["Not born in the neighborhood", "Born in the neighborhood"]; 
    var HouseArray = ["Rents a house in the neighborhood", "Owns a house in the neighborhood"];
    
    // Political Experience Array
    var PoliticalExperienceArray = ["None", "State legislator", "Congress"]; 

    // Name arrays
    var MaleNames = ["James", "Michael", "William", "John", "David"];
    var FemaleNames = ["Susan", "Jennifer", "Emily", "Olivia", "Barbara"];

    // Fisher-Yates shuffle function
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) { 
            var j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // Function to shuffle array and return a single element
    function shuffle_one(theArray) { 
        return shuffle(theArray.slice())[0]; // Avoid modifying original array
    }

    // Function to select two different names from respective lists
    function getRandomNames(gender1, gender2) {
        let name1, name2;
        if (gender1 === "Male") {
            let shuffledMales = shuffle(MaleNames);
            name1 = shuffledMales[0];
            name2 = gender2 === "Male" ? shuffledMales[1] : shuffle_one(FemaleNames);
        } else {
            let shuffledFemales = shuffle(FemaleNames);
            name1 = shuffledFemales[0];
            name2 = gender2 === "Female" ? shuffledFemales[1] : shuffle_one(MaleNames);
        }
        return [name1, name2];
    }

    // Generate profile pairs
    function genprof() {
        var gender1 = shuffle_one(GenderArray);
        var gender2 = shuffle_one(GenderArray);
        var [name1, name2] = getRandomNames(gender1, gender2);

        var attributes = [
            { label: "Education", value1: shuffle_one(EducationArray), value2: shuffle_one(EducationArray) },
            { label: "Race", value1: shuffle_one(RaceArray), value2: shuffle_one(RaceArray) },
            { label: "Family ties", value1: shuffle_one(FamilyArray), value2: shuffle_one(FamilyArray) },
            { label: "Time spent living as an adult", value1: shuffle_one(ResidenceLengthArray), value2: shuffle_one(ResidenceLengthArray) },
            { label: "Birthplace", value1: shuffle_one(BirthArray), value2: shuffle_one(BirthArray) },
            { label: "Residence", value1: shuffle_one(HouseArray), value2: shuffle_one(HouseArray) },
            { label: "Political Experience", value1: shuffle_one(PoliticalExperienceArray), value2: shuffle_one(PoliticalExperienceArray) },
            { label: "Age", value1: "44", value2: "44" }
        ];

        // Ensure "Congress" is gendered appropriately
        attributes.forEach(attr => {
            if (attr.label === "Political Experience") {
                if (attr.value1 === "Congress") {
                    attr.value1 = gender1 === "Male" ? "Congressman" : "Congresswoman";
                }
                if (attr.value2 === "Congress") {
                    attr.value2 = gender2 === "Male" ? "Congressman" : "Congresswoman";
                }
            }
        });

        // Retrieve attribute order if already set, otherwise shuffle and set it
let storedAttributeOrder = Qualtrics.SurveyEngine.getEmbeddedData("attribute_order");

if (storedAttributeOrder) {
    // Use the stored order (convert from JSON string back to array)
    let orderedLabels = JSON.parse(storedAttributeOrder);

    // Reorder attributes based on stored order
    attributes.sort((a, b) => orderedLabels.indexOf(a.label) - orderedLabels.indexOf(b.label));
} else {
    // First repetition: Shuffle attributes and save order
    shuffle(attributes);
    let attributeOrderLabels = attributes.map(a => a.label);
    
    // Store in Qualtrics Embedded Data
    Qualtrics.SurveyEngine.setEmbeddedData("attribute_order", JSON.stringify(attributeOrderLabels));
}

        return { profiles: [[name1, gender1], [name2, gender2]], attributes };
    }

	// Get current round from embedded data, default to 1 if not set
    let currentRound = parseInt(Qualtrics.SurveyEngine.getEmbeddedData("current_round")) || 1;
    console.log("Current Round:", currentRound); // Debugging
	
    // Generate profiles
    let { profiles, attributes } = genprof();

	// Format the names with "(First candidate)" and "(Second candidate)"
    let profile1Name = profiles[0][0] + " (First candidate)";
    let profile2Name = profiles[1][0] + " (Second candidate)";
    
    // Store data for this round with unique keys
    Qualtrics.SurveyEngine.setEmbeddedData("profile1_round" + currentRound, profile1Name);
    Qualtrics.SurveyEngine.setEmbeddedData("profile2_round" + currentRound, profile2Name);
   
// Store round attribute order for post treatment
	Qualtrics.SurveyEngine.setEmbeddedData("attribute_order" + currentRound, JSON.stringify(attributes.map(a => a.label)));

	// Store attribute data for profiles
attributes.forEach((attr, index) => {
    let attrKey = attr.label.replace(/\s+/g, "_").toLowerCase(); // Convert to a safe format
    
    Qualtrics.SurveyEngine.setEmbeddedData("profile1_" + attrKey + "_round" + currentRound, attr.value1);
    Qualtrics.SurveyEngine.setEmbeddedData("profile2_" + attrKey + "_round" + currentRound, attr.value2);
});
	
	// Update table headers with names
    document.getElementById("profile1_name").textContent = profiles[0][0]; 
    document.getElementById("profile2_name").textContent = profiles[1][0];

    // Clear and repopulate the table body dynamically
    let tableBody = document.querySelector("#conjointTable tbody");
    tableBody.innerHTML = ""; // Clear previous rows

    attributes.forEach(attr => {
        let row = document.createElement("tr");

        let labelCell = document.createElement("td");
        labelCell.textContent = attr.label;

        let profile1Cell = document.createElement("td");
        profile1Cell.textContent = attr.value1;

        let profile2Cell = document.createElement("td");
        profile2Cell.textContent = attr.value2;

        row.appendChild(labelCell);
        row.appendChild(profile1Cell);
        row.appendChild(profile2Cell);
        tableBody.appendChild(row);
    });

	// Increment round number for next iteration
    let nextRound = currentRound + 1;
    Qualtrics.SurveyEngine.setEmbeddedData("current_round", nextRound);

    console.log("Next Round Set to:", nextRound); // Debugging
	
    // Dynamically update question text in the same block
    setTimeout(function () {
        document.querySelectorAll(".QuestionText").forEach(q => {
            q.innerHTML = q.innerHTML
                .replace(/\[PROFILE1\]/g, profile1Name)
                .replace(/\[PROFILE2\]/g, profile2Name);
        });
    }, 500);
});
