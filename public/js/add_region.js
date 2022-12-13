// Get the objects we need to modify
let addRegionForm = document.getElementById('add-region-form-ajax');

// Modify the objects we need
addRegionForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRegionName = document.getElementById("input-regionName");

    // Get the values from the form fields
    let regionNameValue = inputRegionName.value;

    // Put our data we want to send in a javascript object
    let data = {
        regionName: regionNameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-region-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRegionName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// regions
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("region-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let regionIDCell = document.createElement("TD");
    let regionNameCell = document.createElement("TD");

    // Fill the cells with correct data
    regionIDCell.innerText = newRow.regionID;
    regionNameCell.innerText = newRow.regionName;

    // Add the cells to the row 
    row.appendChild(regionIDCell);
    row.appendChild(regionNameCell);

    row.setAttribute('data-value', newRow.regionID);

    // Add the row to the table
    currentTable.appendChild(row);
}