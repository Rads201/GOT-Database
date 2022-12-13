// Get the objects we need to modify
let updateSubjectForm = document.getElementById('update-subject-form-ajax');

// Modify the objects we need
updateSubjectForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSubjectName = document.getElementById("input-subjectNameUpdate");
    let inputOccupation = document.getElementById("input-occupationUpdate");
    let inputHouse = document.getElementById("input-houseIDUpdate");

    // Get the values from the form fields
    let subjectNameValue = inputSubjectName.value;
    let occupationValue = inputOccupation.value;
    let houseValue = inputHouse.value;

    if (isNaN(houseValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        subjectName: subjectNameValue,
        occupation: occupationValue,
        house: houseValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-subject-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, subjectNameValue, occupationValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, subjectID, occupation){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("subject-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == subjectID) {

            // Get the location of the row where we found the matching subject ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td1 = updateRowIndex.getElementsByTagName("td")[2]

            let td2 = updateRowIndex.getElementsByTagName("td")[3];

            td1.innerHTML = occupation;
            if (parsedData.length === 0) {
                td2.innerHTML = ""
            }
            else {
                td2.innerHTML = parsedData[0].houseID; 
            }
       }
    }
}