// File main.js
'use strict';
(function () {
  // Put a handler on the major pin for click
  window.render.mainPin.addEventListener('click', window.activeForm);

  // Put a handler on the major pin for keydownn
  window.render.mainPin.addEventListener('keydown', window.onMapPinEnterPress);
})();
