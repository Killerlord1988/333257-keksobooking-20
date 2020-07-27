// File pin.js
'use strict';

(function () {
  // Create data for saving list of features
  var data = [];

  var pin = {
    onAccomodationChange: function () {},
    onPriceChange: function () {},
    onRoomsChange: function () {},
    onGuestsChange: function () {},
    onFeaturesChange: function () {}
  };

  // Find all selects and inputs
  var typeOfHouseSelect = document.querySelector('#housing-type');
  var priceSelect = document.querySelector('#housing-price');
  var roomsSelect = document.querySelector('#housing-rooms');
  var guestsSelect = document.querySelector('#housing-guests');
  var featuresSelect = document.querySelector('#housing-features');

  // Put a handler on inputs of features
  featuresSelect.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;

    // Define is there a feature in the list or not. If not add it
    if (data.indexOf(value) >= 0) {
      data.splice(data.indexOf(value), 1);
    } else {
      data.push(value);
    }
    pin.onFeaturesChange(data);
  });

  // Put handlers on selects of the filter
  typeOfHouseSelect.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onAccomodationChange(value);
  });
  priceSelect.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onPriceChange(value);
  });
  roomsSelect.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onRoomsChange(value);
  });
  guestsSelect.addEventListener('change', function (evt) {
    window.render.deleteAdvert();
    var value = evt.target.value;
    pin.onGuestsChange(value);
  });

  window.pin = pin;
  window.data = data;

}());
