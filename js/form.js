// File main.js
'use strict';
(function () {
  var form = document.querySelector('.ad-form');

  var DEFAULT_OPTION_IDX = 2;
  var NOT_GUEST_OPTION_IDX = 3;

  var MAIN_PIN_X = 65;
  var MAIN_PIN_Y = 65;
  var MAIN_PIN_X_ACTIVE = 65;
  var MAIN_PIN_Y_ACTIVE = 81;
  var COORD_Y = {
    min: 130,
    max: 630
  };

  var MINPRICE_OF_ACCOMODATION = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var ROOMS_GUESTS_RELATION = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    0: [0]
  };

  var ROOMS = [1, 2, 3, 0];
  var GUESTS = [3, 2, 1, 0];

  var isActive = false;

  var advertFieldsets = form.querySelectorAll('fieldset');
  var filters = document.querySelectorAll('.map__filters select');
  var featuresList = document.querySelector('#housing-features');

  // Create a function for setting 'disabled' on fields of the form
  var setOptionDisabled = function (fields) {
    for (var j = 0; j < fields.length; j++) {
      var fieldsetItem = fields[j];
      fieldsetItem.setAttribute('disabled', 'disabled');
    }
  };

  var deleteOptionDisabled = function (data) {
    for (var k = 0; k < data.length; k++) {
      var objectItem = data[k];
      objectItem.removeAttribute('disabled', 'disabled');
    }
  };

  // Set 'disabled' on each fieldset of the form
  setOptionDisabled(advertFieldsets);
  setOptionDisabled(filters);
  featuresList.setAttribute('disabled', 'disabled');

  var roundedNumber = function (number) {
    return '' + number.toFixed(0);
  };

  // Create function to set address in a form
  var getAddress = function (pinX, pinY) {
    var addressInput = document.querySelector('#address');
    var pointX = parseInt(window.render.mainPin.style.left, 10) + pinX / 2;
    var pointY = null;

    if (pinY === MAIN_PIN_Y) {
      pointY = parseInt(window.render.mainPin.style.top, 10) + pinY / 2;
    } else {
      pointY = parseInt(window.render.mainPin.style.top, 10) + pinY;
    }

    addressInput.setAttribute('value', roundedNumber(pointX) + ', ' + roundedNumber(pointY));
  };

  // var removeClass = function (node, className) {
  //   node.classList.remove(className);
  // };

  // Set address on the inactive map
  getAddress(MAIN_PIN_X, MAIN_PIN_Y);

  // Create function for deleting 'disabled' from each fieldset of the form
  var mousedown = function (fieldsets) {
    for (var k = 0; k < fieldsets.length; k++) {
      var fieldset = fieldsets[k];
      fieldset.removeAttribute('disabled', 'disabled');
    }

    // Active filds of the filter
    deleteOptionDisabled(filters);
    featuresList.removeAttribute('disabled', 'disabled');

    // Render pins on the map from server data
    var server = window.filter;
    window.request.load(server.successHandler, server.errorHandler);

    // Change сoordinates for pin in the field of address
    // getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);

    // Render advert on the map from buffer
    // window.pin.map.insertBefore(window.advert.advert, window.pin.map.querySelector('.map__filters-container'));

    window.render.map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.render.mainPin.removeEventListener('click', activeForm);
    isActive = true;
    return isActive;
  };

  // Put a function in constant for way to delete it from a handler
  var activeForm = function () {
    mousedown(advertFieldsets);
  };


  // Create function for activating form by pressing Enter
  var onMapPinEnterPress = function (evt) {
    if (evt.keyCode === window.util.ENT_CODE) {
      mousedown(advertFieldsets);
      getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);
      window.render.mainPin.removeEventListener('keydown', onMapPinEnterPress);
    }
  };

  // Put a handler on the major pin for keydownn
  window.render.mainPin.addEventListener('keydown', onMapPinEnterPress);

  window.render.mainPin.addEventListener('mousedown', function (evt) {

    if (!isActive) {
      mousedown(advertFieldsets);
    }

    var Coord = function (x, y) {
      this.x = x;
      this.y = y;
    };

    var startCoords = new Coord(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);

      var coordX = startCoords.x - moveEvt.clientX;
      var coordY = startCoords.y - moveEvt.clientY;

      var shift = new Coord(coordX, coordY);

      startCoords = new Coord(moveEvt.clientX, moveEvt.clientY);

      var offsetLeft = window.render.mainPin.offsetLeft;
      var offsetTop = window.render.mainPin.offsetTop;

      if (offsetLeft - shift.x + MAIN_PIN_X_ACTIVE / 2 < 0) {
        startCoords.x = '0px' + MAIN_PIN_X_ACTIVE;
        return startCoords.x;

      } else if (offsetLeft - shift.x + MAIN_PIN_X_ACTIVE / 2 > window.render.map.clientWidth) {
        startCoords.x = window.render.map.clientWidth + 'px';
        return startCoords.x;
      }

      if (offsetTop - shift.y + MAIN_PIN_Y_ACTIVE > COORD_Y.max) {
        startCoords.y = COORD_Y.max + 'px';
        return startCoords.y;

      } else if (offsetTop - shift.y + MAIN_PIN_Y_ACTIVE / 2 < COORD_Y.min) {
        startCoords.y = COORD_Y.min + 'px';
        return startCoords.y;
      }

      window.render.mainPin.style.top = (offsetTop - shift.y) + 'px';
      window.render.mainPin.style.left = (offsetLeft - shift.x) + 'px';

      return '1'; // eslint error
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      // Change сoordinates for pin in the field of address
      getAddress(MAIN_PIN_X_ACTIVE, MAIN_PIN_Y_ACTIVE);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  // Find list of options of rooms
  var selectRooms = document.querySelector('#room_number');
  var selectGuests = document.querySelector('#capacity');
  var optionGuests = selectGuests.querySelectorAll('option');

  // Put disabled on list of guests to avoid bag with 1 room and 1 guest when the page
  // will be opened without changing amount of rooms
  setOptionDisabled(optionGuests);
  optionGuests[2].removeAttribute('disabled', 'disabled');

  // Create a function to cansel disabled on option for choosing guests
  var getAvailableGuests = function () {
    setOptionDisabled(optionGuests);
    var selectedRoom = selectRooms.selectedIndex;
    var dataGuests = ROOMS_GUESTS_RELATION[ROOMS[selectedRoom]];

    for (var j = 0; j < GUESTS.length; j++) {
      for (var k = 0; k < dataGuests.length; k++) {
        if (GUESTS[j] === dataGuests[k]) {
          optionGuests[j].removeAttribute('disabled', 'disabled');
        }

        // Selecting one guest to avoid validation errors
        if (selectedRoom < dataGuests.length) {
          selectGuests.selectedIndex = DEFAULT_OPTION_IDX;
        } else {
          selectGuests.selectedIndex = NOT_GUEST_OPTION_IDX;
        }
      }
    }
  };

  // Put a handler on to control the list of guests
  selectRooms.addEventListener('change', function () {
    getAvailableGuests();
  });

  // Find field of type of accomodation
  var type = document.querySelector('#type');

  // Create a function for defining min price for type of accomodation
  var getMinPriceOfAccomodation = function () {
    var typyOptions = type.querySelectorAll('option');
    var price = document.querySelector('#price');
    var index = type.selectedIndex;
    price.setAttribute('min', MINPRICE_OF_ACCOMODATION[typyOptions[index].value]);
    price.setAttribute('placeholder', MINPRICE_OF_ACCOMODATION[typyOptions[index].value]);
  };

  // Put on a handler if type of accomodation is changed
  type.addEventListener('change', function () {
    getMinPriceOfAccomodation();
  });

  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');

  timein.addEventListener('change', function () {
    timeout.value = timein.value;
  });

  timeout.addEventListener('change', function () {
    timein.value = timeout.value;
  });

  form.addEventListener('submit', function (evt) {
    window.request.upload(new FormData(form), window.request.uploadSuccessHandler, window.request.uploadErrorHandler);
    evt.preventDefault();
  });

  window.form = {
    form: form,
    MAIN_PIN_X_ACTIVE: MAIN_PIN_X_ACTIVE,
    MAIN_PIN_Y_ACTIVE: MAIN_PIN_X_ACTIVE,
    MAIN_PIN_X: MAIN_PIN_X,
    MAIN_PIN_Y: MAIN_PIN_Y,
    getAddress: getAddress,
    mousedown: mousedown
  };
})();
