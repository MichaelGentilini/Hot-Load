// var requirejs = require('../js/r.js');

// var axios = require("axios");
// var $ = require("jquery");

$("#shipperSubmit").on("click", function (e) {
  e.preventDefault();
  console.log($("#shipperBegin").val());
  console.log($("#shipperEnd").val());
});

$("#carrierSubmit").on("click", function (e) {
  e.preventDefault();
  var carBegin = $("#carrierBegin").val();
  var carEnd = $("#carrierBeginDistance").val();
  console.log($("#carrierEnd").val());
  console.log($("#carrierEndDistance").val());
  console.log(carBegin);
  console.log(carEnd);
  getLatLng(carBegin);
  getLatLng(carEnd);
});

function getLatLng(userAddress) {
  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: userAddress,
        key: "AIzaSyA2Z73bHqtsEJuas82kslWAoAegg5Rxrco",
      },
    })
    .then(function (response) {
      var formattedAddress = response.data.results[0].formatted_address;
      var newUserLat = response.data.results[0].geometry.location.lat;
      var newUserLng = response.data.results[0].geometry.location.lng;

      console.log(formattedAddress, newUserLat, newUserLng);
    });
}

// ! Google Maps autocomplete Address
function init() {
  var shipBeginAuto = document.getElementById('shipperBegin');
  var shipEndAuto = document.getElementById('shipperEnd');
  var carBeginAuto = document.getElementById('carrierBegin');
  var carEndAuto = document.getElementById('carrierEnd');
  var autocomplete = new google.maps.places.Autocomplete(shipBeginAuto);
  var autocomplete2 = new google.maps.places.Autocomplete(shipEndAuto);
  var autocomplete3 = new google.maps.places.Autocomplete(carBeginAuto);
  var autocomplete4 = new google.maps.places.Autocomplete(carEndAuto);
}
google.maps.event.addDomListener(window, 'load', init);





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
// $exampleList.on("click", ".delete", handleDeleteBtnClick);