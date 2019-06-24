// todo find a way to display the data for the user assigned to Manny

var presetValue = "car";

// @ clear data for shipper
function clearShipmentData() {
  $("#shipperBegin").val(null),
    $("#shipperEnd").val(null),
    $("#shipperPrice").val(null),
    $("input[name='gridRadios']").filter("[value='" + presetValue + "']").prop("checked", true),
    $("#shipperDetail").val(null);
};
// @ Event Listener for Shipper Info
$("#shipperSubmit").on("click", function (e) {
  e.preventDefault();
  var shipBeginCity = "";
  var shipBegin = $("#shipperBegin").val();
  var shipEnd = $("#shipperEnd").val();
  var shipPrice = $("#shipperPrice").val();
  var shipItem = $("input[name='gridRadios']:checked").val();
  var shipDetail = $("#shipperDetail").val();
  var shipBegin2 = shipBegin.split(', ');

  // @ get the city from the address input
  function getCity() {
    for (key in shipBegin2) {
      var city = shipBegin2.length - 3;
      if (+key === city) {
        shipBeginCity = shipBegin2[key];
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

  // @ function(s) to create the shipment object
  function createShipment(distance) {
    addShipment({
      begin: shipBegin,
      beginCity: shipBeginCity,
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

// @ clear data for carrier 
function clearCarrierData() {
  $("#carrierBegin").val(null),
    $("#carrierBeginDistance").val(null),
    // $("input[name='Radios']").filter("[value='" + presetValue + "']").prop("checked", false),
    $("input[name=Radios]").prop("checked", false),
    $("#MinCarrierPrice").val(null)
};

// @Event Listener for Carrier Info
$("#carrierSubmit").on("click", function (e) {
  e.preventDefault();
  var carBeginCity = "";
  var carBegin = $("#carrierBegin").val();
  var carBeginDistance = $("#carrierBeginDistance").val();
  var carItem = $("input[name='Radios']:checked").val();
  var carBegin2 = carBegin.split(', ');

  function getCarCity() {
    for (key in carBegin2) {
      var city = carBegin2.length - 3;
      if (+key === city) {
        carBeginCity = carBegin2[key];
      }
    }

    console.log('carItem data:', carItem, carItem === undefined, carItem === '');
    console.log('carBeginDistance data:', carBeginDistance, carBeginDistance === undefined, carBeginDistance === '');

    if (carBeginDistance === '' & !carItem) {
      console.log('running citySearch')
      citySearch(carBeginCity);
    } else if (carBeginDistance !== "") {
      console.log('running citySearchDistance')
      citySearchDistance(carBeginCity);
    } else if (carItem !== "" && carBeginDistance === "") {
      console.log('running citySearchItem')
      citySearchItem(carBeginCity)
    } else {
      console.log('no search ran');
    }
  }

  // @Search for shipments by city
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

  // ? Search for shipments by city with distance
  function citySearchDistance(carBeginCity) {
    var distance = carBeginDistance;
    if (carItem == undefined) {
      carItem = "car";
    }

    try {
      $.get("/api/shipments/" + carBeginCity + "/" + carItem + "/" + distance, function (data) {
        if (data == '') {
          console.log('\n\t\t\t= = = = = = = = = = = No shipments with more than ' + distance + ' miles were found leaving', carBeginCity, '= = = = = = = = = = ');
        }
        console.table(data);
      });
    } catch (err) {
      console.log(err);
      console.log('nothing matches');
    }
  }

  // @Search for shipments by city with Load Type
  function citySearchItem(carBeginCity) {
    var item = carItem;
    try {
      $.get("/api/shipments/" + carBeginCity + "/" + item, function (data) {
        if (data == '') {
          console.log('\n\t\t\t= = = = = = = = = = = No shipments for ' + item + ' were found leaving', carBeginCity, '= = = = = = = = = = ');
        }
        console.table(data);
      });
    } catch (err) {
      console.log(err);
      console.log('nothing matches');
    }
  }

  if (carBegin !== "") {
    console.log("\n= = = = = = = = = = = = = Searching Parameters = = = = = = = = = = = = = ");
    console.log("Beginning: \t", carBegin);
    if (carBeginDistance !== "") {
      console.log("Min Dist: \t", carBeginDistance, "miles");
    } else {
      console.log("Min Dist: \t", "No distance in this search");
    }
    if (carBeginDistance !== "") {
      console.log("Load Type: \t", carItem);
    } else {
      console.log("Load Type: \t", "car will be used for this search");
    }
    getCarCity();
    clearCarrierData();
  } else {
    console.log("please enter a starting City")
  }
});

// ! view all Shipments 
$("#viewShipments").on("click", function () {
  $.get("/api/shipments", function (data) {
    console.table(data);

    console.log("there are ", data.length, "shipments")
    data.slice(-5).forEach(load => {
      if (load.details === "") {
        load.details = "no details provided"
      }
      var $shipbtn = $("<button shipmentId=" + load.id + "> ");
      $shipbtn.addClass("btn btn-block btn-outline-info ml-2 mt-2 mb-2 text-left");
      $shipbtn.html(
        "From:&nbsp;&nbsp;&nbsp;&nbsp;" +
        load.begin +
        "<br>" + "To:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        load.end +
        "<br>" + "Type:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        load.item +
        // "<br>" + "Details:&nbsp;" +
        // load.details +
        "<br>" + "Pay:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $" +
        load.price * load.miles +
        "<br>"
      );
      $shipbtn.appendTo("#results");
    });
  });
});

// @ using Google to autocomplete address
function init() {
  var shipBeginAuto = document.getElementById("shipperBegin");
  var shipEndAuto = document.getElementById("shipperEnd");
  var carBeginAuto = document.getElementById("carrierBegin");
  var autocomplete = new google.maps.places.Autocomplete(shipBeginAuto);
  var autocomplete2 = new google.maps.places.Autocomplete(shipEndAuto);
  var autocomplete3 = new google.maps.places.Autocomplete(carBeginAuto);
}
google.maps.event.addDomListener(window, "load", init);

//  ? Get geocode data from user input 
// ? we don't need this for basic functionality right now, but if we want to add search by state, zip, etc this will make it much easier 
// function getLatLng(userAddress) {
//   axios
//     .get("https://maps.googleapis.com/maps/api/geocode/json", {
//       params: {
//         address: userAddress,
//         key: "AIzaSyA2Z73bHqtsEJuas82kslWAoAegg5Rxrco"
//       }
//     })
//     .then(function (response) {
//       res = response.data.results[0];
//       var formattedAddress = res.formatted_address;
//       var newUserLat = res.geometry.location.lat;
//       var newUserLng = res.geometry.location.lng;

//     });
// }

//  @ Use this for Distance
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