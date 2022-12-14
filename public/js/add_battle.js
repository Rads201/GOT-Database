// Get the objects we need to modify
let addBattleForm = document.getElementById('add-battle-form-ajax');

// Modify the objects we need
addBattleForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBattleName = document.getElementById("input-battleName");
    let inputRegion = document.getElementById("input-regionName");
    let inputWinners = document.getElementById("input-winners");
    let inputLosers = document.getElementById("input-losers");

    // Get the values from the form fields
    let battleNameValue = inputBattleName.value;
    let regionValue = inputRegion.value;
    let winnersValue = inputWinners.value;
    let losersValue = inputLosers.value;

    // Put our data we want to send in a javascript object
    let data = {
        battleName: battleNameValue,
        region: regionValue,
        winners: winnersValue,
        losers: losersValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-battle-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBattleName.value = '';
            inputRegion.value = '';
            inputWinners.value = '';
            inputLosers.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// houses
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("battle-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let battleIDCell = document.createElement("TD");
    let battleNameCell = document.createElement("TD");
    let regionCell = document.createElement("TD");
    let winnersCell = document.createElement("TD");
    let losersCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    battleIDCell.innerText = newRow.battleID;
    battleNameCell.innerText = newRow.battleName;
    regionCell.innerText = newRow.region;
    winnersCell.innerText = newRow.winners;
    losersCell.innerText = newRow.losers;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function() {
        deleteHouse(newRow.battleID);
    }

    // Add the cells to the row 
    row.appendChild(battleIDCell);
    row.appendChild(battleNameCell);
    row.appendChild(regionCell);
    row.appendChild(winnersCell);
    row.appendChild(losersCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.battleID);

    // Add the row to the table
    currentTable.appendChild(row);
}