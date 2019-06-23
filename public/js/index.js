// ! view all Shipments
$("#viewShipments").on("click", function () {
  $.get("/api/shipments", function (data) {
    console.table(data);
  });

  // todo  Search a shipment by id
  $.get("/api/shipments/id/" + 30, function (data) {
    if (data !== null) {

      console.log(data);

    } else {
      console.log('unable to find this shipment')
    }
  });
});

// todo find a way to display the data for the user assigned to Manny

// ! clear data function 
var presetValue = "car";

function clearShipmentData() {
  $("#shipperBegin").val(null),
    $("#shipperEnd").val(null),
    $("#shipperPrice").val(null),
    $("input[name='gridRadios']").filter("[value='" + presetValue + "']").prop("checked", true),
    $("#shipperDetail").val(null);
};

function clearCarrierData() {
  $("#carrierBegin").val(null),
    $("#carrierBeginDistance").val(null),
    $("input[name='Radios']").filter("[value='" + presetValue + "']").prop("checked", true),
    $("#MinCarrierPrice").val(null)
};

// ! Event Listener for Shipper Info
$("#shipperSubmit").on("click", function (e) {
  e.preventDefault();
  var beginCity = "";
  var shipBegin = $("#shipperBegin").val();
  var shipEnd = $("#shipperEnd").val();
  var shipPrice = $("#shipperPrice").val();
  var shipItem = $("input[name='gridRadios']:checked").val();
  var shipDetail = $("#shipperDetail").val();

  var shipBegin2 = shipBegin.split(', ');

  function getCity() {
    for (key in shipBegin2) {
      var city = shipBegin2.length - 3;
      if (+key === city) {
        console.log('the city is ', shipBegin2[key]);
        beginCity = shipBegin2[key];
      };
    };
  };

  if (shipBegin !== "" && (shipEnd !== "") & (shipPrice !== "")) {
    getCity();

    shipPrice = Math.abs(parseFloat(shipPrice).toFixed(2));
    console.log("\n" + "From:\t\t", $("#shipperBegin").val());
    console.log("To: \t\t", $("#shipperEnd").val());
    console.log("Shipping \t", shipItem);
    if (shipDetail !== "") {
      console.log("Details \t", shipDetail);
    } else {
      console.log("Details \t", "No details provided");
    }
    getDistance(shipBegin, shipEnd, shipPrice, createShipment);
    clearShipmentData();

  } else {
    console.log(
      "please enter a begining address, ending address, and compensation");
  }

  // todo we need to catch anything that doesn't work like an out of country address or invalid data

  function createShipment(distance) {

    addShipment({
      begin: shipBegin,
      beginCity: beginCity,
      end: shipEnd,
      item: shipItem,
      details: shipDetail,
      price: shipPrice,
      miles: distance,
      available: true
    });
  }
});

function addShipment(shipmentObj) {
  $.post("/api/shipments", shipmentObj)
    .then(
      console.log('Your shipment has been added')
    );
}

// ! Event Listener for Carrier Info
$("#carrierSubmit").on("click", function (e) {
  e.preventDefault();
  var carBeginCity = "";
  var carBegin = $("#carrierBegin").val();
  var carBeginDistance = $("#carrierBeginDistance").val();
  var carPrice = $("#MinCarrierPrice").val();

  var carBegin2 = carBegin.split(', ');

  function getCarCity() {
    for (key in carBegin2) {
      var city = carBegin2.length - 3;
      if (+key === city) {
        carBeginCity = carBegin2[key];
      }
    }
    console.log('\n\t\t\t\t\t\t - - - - - -  searching for shipments in', carBeginCity, ' ----');
    citySearch(carBeginCity);
  }

  function citySearch(carBeginCity) {
    try {
      $.get("/api/shipments/" + carBeginCity, function (data) {
        if (data == '') {
          console.log('\n\t\t\t= = = = = = = = = = = No shipments were found in', carBeginCity, '= = = = = = = = = = ');
        }
        console.table(data);
      });
    } catch (err) {
      console.log(err);
      console.log('nothing matches');
    }
  }


  if (carBegin !== "") {
    console.log("\nBeginning: \t", carBegin);
    if (carBeginDistance !== "") {
      console.log("Min Dist: \t", carBeginDistance);
    } else {
      console.log("Min Dist: \t", "No distance in this search");
    }

    if (carPrice !== "") {
      console.log("Pay: \t\t", carPrice);
    } else {
      console.log("Pay: \t\t", "Price doesn't matter");
    }
    getCarCity();
    clearCarrierData();
  } else {
    "please enter a starting City"
  }
});

// ! Google Maps autocomplete Address
function init() {
  var shipBeginAuto = document.getElementById("shipperBegin");
  var shipEndAuto = document.getElementById("shipperEnd");
  var carBeginAuto = document.getElementById("carrierBegin");
  var autocomplete = new google.maps.places.Autocomplete(shipBeginAuto);
  var autocomplete2 = new google.maps.places.Autocomplete(shipEndAuto);
  var autocomplete3 = new google.maps.places.Autocomplete(carBeginAuto);
}
google.maps.event.addDomListener(window, "load", init);


//  ! Get geocode data from user input 
// ? we don't need this for basic functionality right now, but if we want to add search by state, zip, etc this will make it much easier 
function getLatLng(userAddress) {
  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: userAddress,
        key: "AIzaSyA2Z73bHqtsEJuas82kslWAoAegg5Rxrco"
      }
    })
    .then(function (response) {
      res = response.data.results[0];
      var formattedAddress = res.formatted_address;
      var newUserLat = res.geometry.location.lat;
      var newUserLng = res.geometry.location.lng;
      // console.table(formattedAddress, newUserLat, newUserLng);
    });
}

//  ! Use this for Distance
function getDistance(Add1, Add2, shipPrice, createShipment) {
  axios.get(`/api/distance/${Add1}/${Add2}`)

    .then(function (response) {
      var duration = response.data.duration.text;
      console.log("Est. Time\t", duration);
      console.log("Distance \t", response.data.distance.text);

      var distance = response.data.distance.text.split(" ")[0].replace(/\,/g, "");

      if (shipPrice) {

        console.log("Rate \t\t $" + shipPrice + " per mile");
        var finalCost = parseFloat(distance).toFixed(2) * shipPrice;
        console.log("Total Cost \t $" + finalCost.toFixed(2));
      }

      createShipment(distance);
    })
    .catch(function (err) {
      console.log('\n\t\t\t\t\t = = = = = = = = Unfortunately, we cannot ship to this area! = = = = = = = ');
    });
}

// // Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// // The API object contains methods for each kind of request we'll make
// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick)