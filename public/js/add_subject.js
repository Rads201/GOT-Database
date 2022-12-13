// Get the objects we need to modify
let addSubjectForm = document.getElementById('add-subject-form-ajax');

// Modify the objects we need
addSubjectForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSubjectName = document.getElementById("input-subjectName");
    let inputOccupation = document.getElementById("input-occupation");
    let inputHouse = document.getElementById("input-houseName");

    // Get the values from the form fields
    let subjectNameValue = inputSubjectName.value;
    let occupationValue = inputOccupation.value;
    let houseValue = inputHouse.value;

    // Put our data we want to send in a javascript object
    let data = {
        subjectName: subjectNameValue,
        occupation: occupationValue,
        house: houseValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-subject-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSubjectName.value = '';
            inputOccupation.value = '';
            inputHouse.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// subjects
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("subject-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let subjectIDCell = document.createElement("TD");
    let subjectNameCell = document.createElement("TD");
    let occupationCell = document.createElement("TD");
    let houseCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    subjectIDCell.innerText = newRow.subjectID;
    subjectNameCell.innerText = newRow.subjectName;
    occupationCell.innerText = newRow.occupation;
    houseCell.innerText = newRow.house;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function() {
        deleteHouse(newRow.subjectID);
    }

    // Add the cells to the row 
    row.appendChild(subjectIDCell);
    row.appendChild(subjectNameCell);
    row.appendChild(occupationCell);
    row.appendChild(houseCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.subjectID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option,
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("input-subjectName");
    let option = document.createElement("option");
    option.text = newRow.subjectName;
    option.value = newRow.subjectID;
    selectMenu.add(option);
    // End of new step 8 code.
}