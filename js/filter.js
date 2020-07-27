// File filter.js
'use strict';

(function () {
  var DEFAULT_FILTER = 'any';

  var filtersBlock = {
    type: document.querySelector('#housing-type'),
    price: document.querySelector('#housing-price'),
    rooms: document.querySelector('#housing-rooms'),
    guests: document.querySelector('#housing-guests'),
    features: document.querySelector('#housing-features')
  };

  var featuresLists = Array.from(filtersBlock.features.querySelectorAll('input'));
  var filterFeatures = document.querySelectorAll('input[name=features]');

  // Copy data which was got from the server
  var pins = [];

  // Create a dictionary for getting a range of price
  var pricesBlock = {
    'middle': {
      min: 10000,
      max: 50000
    },
    'low': 9999,
    'high': 50000
  };

  // Create a function to get a name of a range of a price
  var getRangePrice = function (cost) {
    var typeOfPrice;
    if (cost <= pricesBlock.low) {
      typeOfPrice = 'low';
    } else if (cost >= pricesBlock.middle.min && cost <= pricesBlock.middle.max) {
      typeOfPrice = 'middle';
    } else if (cost > pricesBlock.high) {
      typeOfPrice = 'high';
    }
    return typeOfPrice;
  };

  var updatePins = function () {
    var activeFeatures = featuresLists
      .filter(function (feature) {
        return feature.checked;
      })
      .map(function (feature) {
        return feature.value;
      });

    var temporaryPins = pins.filter(function (pin) {
      return Object.keys(filtersBlock).every(function (key) {
        if (key === 'features') {
          if (activeFeatures.length) {
            return activeFeatures.every(function (feature) {
              return pin.offer[key].includes(feature);
            });
          }
          return true;
        } else {
          var value = filtersBlock[key].value;

          if (value === DEFAULT_FILTER) {
            return true;
          }

          if (key === 'price') {
            return getRangePrice(pin.offer[key]) === value;
          }

          return pin.offer[key].toString() === value;
        }
      });
    });
    window.render.deleteAdvert();
    window.render.getPins(temporaryPins);
  };

  Object.keys(filtersBlock).forEach(function (el) {
    filtersBlock[el].addEventListener('change', updatePins);
  });

  // Callback for rendering pins from server data
  var successHandler = function (data) {
    pins = data;
    window.render.getPins(pins);
  };

  // Callback for showing a error message if data isn't loaded from server
  var errorHandler = function () {

    // Add the pattern in DOM
    document.body.prepend(window.request.error);
  };

  window.filter = {
    successHandler: successHandler,
    errorHandler: errorHandler,
    filtersBlock: filtersBlock,
    filterFeatures: filterFeatures
  };
})();
