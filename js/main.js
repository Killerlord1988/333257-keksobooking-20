// File main.js
'use strict';
(function () {
  // Put a handler on the major pin for click
  window.pin.mainPin.addEventListener('click', window.activateForm);

  // Put a handler on the major pin for keydownn
  window.pin.mainPin.addEventListener('keydown', window.onMapPinEnterPress);
})();
