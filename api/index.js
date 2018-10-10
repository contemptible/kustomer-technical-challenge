// CSV importing code obtained from the following article:
// https://mounirmesselmeni.github.io/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/

 function importDatabase(file) {
  if (window.FileReader) {
    unpackToArray(file[0]);
  } else {
    alert("Please use a browser that supports FileReader.");
  }
}


function unpackToArray(fileToRead) {
  let reader = new FileReader();

  reader.readAsText(fileToRead);
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}


function loadHandler(event) {
  let csv = event.target.result;
  processData(csv);
}


function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
      console.log("Can't read the database file.");
  }
}


// clean this up
function processData(csv) {
  // split the csv into an array where each line is one element
  let allTextLines = csv.split(/\r\n|\n/);
  let lines = [];

  for (let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i].split(',');
          let tarr = [];
          for (let j = 0; j < data.length; j++) {
              tarr.push(data[j]);
          }
          lines.push(tarr);
  }

  let customerArray = [];

  // transforming the database array into an array of properly formatted objects
  lines.forEach(function(customer) {
    let customerObject = {};

    customerObject["name"] = customer[0] + " " + customer[1];
    customerObject["emails"] = [ { "type": "home", "email": customer[2] }];
    customerObject["birthdayAt"] = customer[3];
    customerObject["phones"] = [ { "type": "home", "phone": customer[4] }, { "type": "work", "email": customer[5] }];

    // this is where customerType will be

    customerArray.push(customerObject);
  });

  // attempting to send the data to the kustomer API

  $.ajax({
    url: "https://api.kustomerapp.com/v1/customers",
    contentType: 'application/json',
    headers: { "Authorization": "Bearer " + BEARER_TOKEN },
    method: "POST",
    data: customerArray[0], // just the first user as a test
    success: function(json) {
        console.log("success", json);
    }
  });

}