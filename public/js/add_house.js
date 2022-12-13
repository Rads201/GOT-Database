// Get the objects we need to modify
let addHouseForm = document.getElementById('add-house-form-ajax');

// Modify the objects we need
addHouseForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputHouseName = document.getElementById("input-houseName");
    let inputHouseLord = document.getElementById("input-houseLord");
    let inputArmySize = document.getElementById("input-armySize");
    let inputWealth = document.getElementById("input-wealth");
    let inputRegion = document.getElementById("input-regionName");

    // Get the values from the form fields
    let houseNameValue = inputHouseName.value;
    let houseLordValue = inputHouseLord.value;
    let armySizeValue = inputArmySize.value;
    let wealthValue = inputWealth.value;
    let regionValue = inputRegion.value;

    // Put our data we want to send in a javascript object
    let data = {
        houseName: houseNameValue,
        houseLord: houseLordValue,
        armySize: armySizeValue,
        wealth: wealthValue,
        region: regionValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-house-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputHouseName.value = '';
            inputHouseLord.value = '';
            inputArmySize.value = '';
            inputWealth.value = '';
            inputRegion.value = '';
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
    let currentTable = document.getElementById("house-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let houseIDCell = document.createElement("TD");
    let houseNameCell = document.createElement("TD");
    let houseLordCell = document.createElement("TD");
    let armySizeCell = document.createElement("TD");
    let wealthCell = document.createElement("TD");
    let regionCell = document.createElement("TD");

    // Fill the cells with correct data
    houseIDCell.innerText = newRow.houseID;
    houseNameCell.innerText = newRow.houseName;
    houseLordCell.innerText = newRow.houseLord;
    armySizeCell.innerText = newRow.armySize;
    wealthCell.innerText = newRow.wealth;
    regionCell.innerText = newRow.region;

    // Add the cells to the row 
    row.appendChild(houseIDCell);
    row.appendChild(houseNameCell);
    row.appendChild(houseLordCell);
    row.appendChild(armySizeCell);
    row.appendChild(wealthCell);
    row.appendChild(regionCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.houseID);

    // Add the row to the table
    currentTable.appendChild(row);
}