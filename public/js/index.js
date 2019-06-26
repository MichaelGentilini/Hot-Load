var presetValue = "car";
// @ clear data for shipper
function clearShipmentData() {
  $("#shipperBegin").val(null),
    $("#shipperEnd").val(null),
    $("#shipperPrice").val(null),
    $("input[name='gridRadios']")
    .filter("[value='" + presetValue + "']")
    .prop("checked", true),
    $("#shipperDetail").val(null);
}
// @ Event Listener for Shipper Info
$("#shipperSubmit").on("click", function (e) {
  e.preventDefault();
  var shipBeginCity = "";
  var shipBegin = $("#shipperBegin").val();
  var shipEnd = $("#shipperEnd").val();
  var shipPrice = $("#shipperPrice").val();
  var shipItem = $("input[name='gridRadios']:checked").val();
  var shipDetail = $("#shipperDetail").val();
  var shipBegin2 = shipBegin.split(", ");

  // @ get the city from the address input
  function getCity() {
    for (key in shipBegin2) {
      var city = shipBegin2.length - 3;
      if (+key === city) {
        shipBeginCity = shipBegin2[key];
      }
    }
  }

  if (shipBegin !== "" && (shipEnd !== "") & (shipPrice !== "")) {
    getCity();

    shipPrice = Math.abs(parseFloat(shipPrice).toFixed(2));
    getDistance(shipBegin, shipEnd, shipPrice, createShipment);
    clearShipmentData();
  } else {
    Swal.fire({
      type: "warning",
      text: "please enter a begining address, ending address, and compensation"
    });
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
  $.post("/api/shipments", shipmentObj).then();
}

// @ clear data for carrier
function clearCarrierData() {
  $("#carrierBegin").val(null),
    $("#carrierBeginDistance").val(null),
    $("input[name=Radios]").prop("checked", false),
    $("#MinCarrierPrice").val(null);
}

// @Event Listener for Carrier Info
$("#carrierSubmit").on("click", function (e) {
  e.preventDefault();
  var carBeginCity = "";
  var carBegin = $("#carrierBegin").val();
  var carBeginDistance = $("#carrierBeginDistance").val();
  var carItem = $("input[name='Radios']:checked").val();
  var carBegin2 = carBegin.split(", ");

  function getCarCity() {
    for (key in carBegin2) {
      var city = carBegin2.length - 3;
      if (+key === city) {
        carBeginCity = carBegin2[key];
      }
    }

    // @ Carrier Search Functions
    if ((carBeginDistance === "") & !carItem) {
      citySearch(carBeginCity);
    } else if (carBeginDistance !== "") {
      citySearchDistance(carBeginCity);
    } else if (carItem !== "" && carBeginDistance === "") {
      citySearchItem(carBeginCity);
    }
  }

  // @Search for shipments by city
  function citySearch(carBeginCity) {
    try {
      $.get("/api/shipments/" + carBeginCity, function (data) {
        if (data == "") {
          Swal.fire({
            type: "warning",
            html: "No loads were found which match your criteria"
          });
        }
        showRoutes(data);
      });
    } catch (err) {
      Swal.fire({
        type: "warning",
        html: "No loads were found which match your criteria"
      });
    }
  }

  // ? Search for shipments by city with distance
  function citySearchDistance(carBeginCity) {
    var distance = carBeginDistance;
    if (carItem == undefined) {
      carItem = "car";
    }

    try {
      $.get(
        "/api/shipments/" + carBeginCity + "/" + carItem + "/" + distance,
        function (data) {
          if (data == "") {
            Swal.fire({
              type: "warning",
              html: "No load with " +
                distance +
                " miles were found leaving " +
                carBeginCity
            });
          }
          showRoutes(data);
        }
      );
    } catch (err) {
      Swal.fire({
        type: "error",
        text: err
      });
    }
  }

  // @Search for shipments by city with Load Type
  function citySearchItem(carBeginCity) {
    var item = carItem;
    try {
      $.get("/api/shipments/" + carBeginCity + "/" + item, function (data) {
        if (data == "") {
          Swal.fire({
            type: "warning",
            text: " No shipments for " + item + " were found"
          });
        } else {
          showRoutes(data);
        }

      });
    } catch (err) {
      Swal.fire({
        type: "error",
        text: err
      });
    }
  }

  // @ Run once there's an address entered on the carrier page
  if (carBegin !== "") {
    getCarCity();
    clearCarrierData();
  } else {
    Swal.fire({
      text: " please enter a starting City"
    });
  }
});

// ! view all Shipments
$("#viewShipments").on("click", function () {
  $.get("/api/shipments", function (data) {
    showRoutes(data);
  });
});

function showRoutes(data) {
  $("#results").empty();
  data.slice(-10).forEach(load => {
    if (load.details === "") {
      load.details = "no details provided";
    }
    //! dynamic buttons with JQuery
    var $shipbtn = $(
      "<button Id=" + load.id + " value=" + load.beginCity + "> "
    );
    $shipbtn.addClass(
      "btn btn-block btn-outline-info ml-2 mt-2 mb-2 text-left routeBtn"
    );
    $shipbtn.html(
      "From:&nbsp;&nbsp;&nbsp;&nbsp;" +
      load.begin +
      "<br>" +
      "To:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      load.end +
      "<br>Distance: " +
      load.miles + " miles &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Compensation: $" +
      (load.price * load.miles).toFixed(2) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Load Type: " + load.item
    );
    $shipbtn.appendTo("#results");
  });

  //  @ Event listener for the route button
  $(".routeBtn").on("click", function (e) {
    e.preventDefault();
    var id = this.id;
    var swalBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    Swal.fire({
      title: "Accept load?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {
        swalBootstrapButtons.fire({
          type: "success",
          title: "Load accepted.",
          imageUrl: "/img/truck.jpg"
        });
        // @ Delete Shipment
        $.ajax("/api/shipments/" + id, {
          type: "DELETE"
        }).then(
          function () {
            setTimeout(function () {
              location.reload();
            }, 5000);
          });
      }
    });
  });
}

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

//  @ Use this for Distance
function getDistance(Add1, Add2, shipPrice, createShipment) {
  axios
    .get(`/api/distance/${Add1}/${Add2}`)

    .then(function (response) {
      var duration = response.data.duration.text;
      var distance = response.data.distance.text
        .split(" ")[0]
        .replace(/\,/g, "");

      if (shipPrice) {
        var finalCost = parseFloat(distance).toFixed(2) * shipPrice;
      }

      var swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });

      Swal.fire({
        title: "Shipment Details",
        html: "<strong>Distance</strong> \t" +
          distance +
          " miles <br/>" +
          "<strong>Est. Time:</strong>\t" +
          duration +
          "<br/>" +
          "<strong>Rate:</strong> \t $" +
          shipPrice.toFixed(2) +
          " per mile<br/>" +
          "<strong>Total Cost:</strong>\t $" +
          finalCost.toFixed(2),
        showCancelButton: true,
        confirmButtonText: "Create Shipment",
        cancelButtonText: "No Thanks"
      }).then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire({
            type: "success",
            title: "Your shipment has been created.",
            imageUrl: "/img/truck.jpg"
          });
          createShipment(distance);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            type: "error",
            title: "Cancelled",
            text: "Your shipment was not created!"
          });
        }
      });
    })
    .catch(function (err) {
      Swal.fire({
        type: "warning",
        html: "Unable to schedule that shipment. <br> We don't have amphibious trucks ... Yet! ",
        imageUrl: "/img/amphibious.jpg"
      });
    });
}