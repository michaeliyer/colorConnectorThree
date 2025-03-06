function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



// Available colors
const colors = ["Purple", "Blue", "Green", "Yellow"];

// Color RGB values for blending
const colorMap = {
    "purple": [180, 123, 234],
    "blue": [113, 178, 244],
    "green": [94, 212, 84],
    "yellow": [244, 244, 9]
};

// Available colors
// const colors = ["Purple", "Blue", "Green", "Yellow"];

// const colorMap = {
//     "purple": [128, 0, 128],
//     "blue": [0, 0, 255],
//     "green": [0, 128, 0],
//     "yellow": [255, 255, 0]
// };

// Load dropdowns and data on page load
document.addEventListener("DOMContentLoaded", function () {
    populateDropdowns();
    loadData();
});

// Populate dropdowns with colors
function populateDropdowns() {
    let rows = ["row1", "row2", "row3", "row4"];
    rows.forEach(row => {
        let select = document.getElementById(row);
        select.innerHTML = "";
        let emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Select a color";
        select.appendChild(emptyOption);
        colors.forEach(color => {
            let option = document.createElement("option");
            option.value = color.toLowerCase();
            option.textContent = color;
            select.appendChild(option);
        });
    });
}

// Prevent duplicate colors in dropdowns
function preventDuplicateColors() {
    let selectedColors = new Set();
    let rows = ["row1", "row2", "row3", "row4"];

    rows.forEach(row => {
        let select = document.getElementById(row);
        if (selectedColors.has(select.value)) {
            alert("Each row must have a different color!");
            select.selectedIndex = 0;
        } else if (select.value !== "") {
            selectedColors.add(select.value);
        }
    });
}

// Submit a new entry or update an edit
function submitEntry(isEdit = false) {
    let rows = ["row1", "row2", "row3", "row4"];
    let latestEntry = {};

    rows.forEach(row => {
        latestEntry[row] = document.getElementById(row).value;
    });

    if (Object.values(latestEntry).includes("")) {
        alert("All rows must have a color selected!");
        return;
    }

    // Save latest entry to local storage
    localStorage.setItem("latestEntry", JSON.stringify(latestEntry));

    let entries = JSON.parse(localStorage.getItem("colorConnectorThree")) || [];

    if (isEdit) {
        // Replace the last entry with the new edit
        entries[entries.length - 1] = latestEntry;
    } else {
        entries.push(latestEntry);
    }

    localStorage.setItem("colorConnectorThree", JSON.stringify(entries));

    resetInputs(); // Clears dropdowns
    loadData(); // Updates UI
}

// Reset dropdown inputs
function resetInputs() {
    document.querySelectorAll("select").forEach(select => select.selectedIndex = 0);
}

// Load stored data and update UI
function loadData() {
    let latestEntry = JSON.parse(localStorage.getItem("latestEntry"));
    let entries = JSON.parse(localStorage.getItem("colorConnectorThree")) || [];
    let totals = { row1: {}, row2: {}, row3: {}, row4: {} };

    let latestDiv = document.getElementById("latestEntryText");
    let latestColorBar = document.getElementById("latestColorBar");
    latestColorBar.innerHTML = "";



    if (latestEntry) {
        latestDiv.innerHTML = "";
        for (let row in latestEntry) {
            let capitalizedColor = capitalizeFirstLetter(latestEntry[row]); // Capitalize color name
            latestDiv.innerHTML += `<span class="editable" onclick="editLatestEntry('${row}')">${row.toUpperCase()}: ${capitalizedColor}</span> | `;
            
            let colorBox = document.createElement("div");
            colorBox.className = "color-box";
    
            // Convert color name to RGB using `colorMap`
            let colorRGB = colorMap[latestEntry[row].toLowerCase()]
                ? `rgb(${colorMap[latestEntry[row].toLowerCase()].join(",")})`
                : latestEntry[row];
    
            colorBox.style.background = colorRGB;
            latestColorBar.appendChild(colorBox);
        }
    } else {
        latestDiv.textContent = "No entries yet.";
    }







    
    // if (latestEntry) {
    //     latestDiv.innerHTML = "";
    //     for (let row in latestEntry) {
    //         latestDiv.innerHTML += `<span class="editable" onclick="editLatestEntry('${row}')">${row.toUpperCase()}: ${latestEntry[row]}</span> | `;
    //         let colorBox = document.createElement("div");
    //         colorBox.className = "color-box";

    //         // Convert color name to RGB using `colorMap`
    //         let colorKey = latestEntry[row].toLowerCase();

    //         let colorRGB = colorMap[latestEntry[row].toLowerCase()]
    //             ? `rgb(${colorMap[latestEntry[row].toLowerCase()].join(",")})`
    //             : latestEntry[row];

    //         colorBox.style.background = colorRGB;
    //         latestColorBar.appendChild(colorBox);
    //     }
    // } else {
    //     latestDiv.textContent = "No entries yet.";
    // }

    // Count colors per row
    entries.forEach(entry => {
        for (let row in entry) {
            let color = entry[row].toLowerCase();
            totals[row][color] = (totals[row][color] || 0) + 1;
        }
    });

    displayTotals(totals);
    displayBlendedColors(totals);
}

// Edit the latest entry by refilling dropdowns
function editLatestEntry(row) {
    let latestEntry = JSON.parse(localStorage.getItem("latestEntry"));
    if (!latestEntry) return alert("No entry to edit.");

    for (let r in latestEntry) {
        document.getElementById(r).value = latestEntry[r];
    }

    // Prompt user to confirm editing
    if (confirm("Edit the latest entry? Changes will be saved.")) {
        submitEntry(true); // Calls submitEntry with edit flag
    }
}

// Display total breakdown


function displayTotals(totals) {
    let totalDiv = document.getElementById("totals");
    totalDiv.innerHTML = "";

    for (let row in totals) {
        let text = `${row.toUpperCase()}: `;
        for (let color in totals[row]) {
            let capitalizedColor = capitalizeFirstLetter(color);
            text += `${capitalizedColor} (${totals[row][color]}), `;
        }
        totalDiv.innerHTML += `<p>${text.slice(0, -2)}</p>`;
    }
}






// function displayTotals(totals) {
//     let totalDiv = document.getElementById("totals");
//     totalDiv.innerHTML = "";

//     for (let row in totals) {
//         let text = `${row.toUpperCase()}: `;
//         for (let color in totals[row]) {
//             text += `${color} (${totals[row][color]}), `;
//         }
//         totalDiv.innerHTML += `<p>${text.slice(0, -2)}</p>`;
//     }
// }

// Calculate blended color for a row
function calculateBlendedColor(colorCounts) {
    let total = 0;
    let rgbSum = [0, 0, 0];

    for (let color in colorCounts) {
        let normalizedColor = Object.keys(colorMap).find(c => c.toLowerCase() === color.toLowerCase());

        if (normalizedColor) {
            let weight = colorCounts[color];
            total += weight;
            rgbSum = rgbSum.map((val, i) => val + colorMap[normalizedColor][i] * weight);
        }
    }

    if (total === 0) return "white"; // Default color if no data

    let avgRGB = rgbSum.map(val => Math.round(val / total));
    return `rgb(${avgRGB.join(",")})`;
}

// Display blended colors per row
function displayBlendedColors(totals) {
    let blendedDiv = document.getElementById("blendedColors");
    blendedDiv.innerHTML = "";

    for (let row in totals) {
        let blendedColor = calculateBlendedColor(totals[row]);

        let colorBox = document.createElement("div");
        colorBox.className = "color-box";
        colorBox.style.background = blendedColor;
        colorBox.style.border = "1px solid black";

        blendedDiv.appendChild(colorBox);
    }
}

// Delete Latest Entry
function deleteLatestEntry() {
    if (confirm("Are you sure you want to delete the latest entry?") &&
        confirm("This action cannot be undone. Proceed?")) {
        localStorage.removeItem("latestEntry");
        let entries = JSON.parse(localStorage.getItem("colorConnectorThree")) || [];
        entries.pop(); // Remove last entry
        localStorage.setItem("colorConnectorThree", JSON.stringify(entries));
        loadData();
    }
}

// Clear all data
function clearAllData() {
    if (confirm("Are you sure you want to clear ALL data?") &&
        prompt("Type 'DELETE' to confirm.") === "DELETE") {
        localStorage.clear();
        loadData();
    }
}