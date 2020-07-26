// File util.js
'use strict';

(function () {
  window.util = {
    ENT_KEY: 'Enter', // Keycode of enter button
    ESC_KEY: 'Escape', // Keycode of escape button

    // Generating a random array
    getRandomData: function (dataSet) {

      // Generating a random array length
      var randomNumber = this.getRandomFloat(0, dataSet.length);
      var data = [];
      // Write data from the array passed to the parameter into a random array
      for (var key = 0; key < randomNumber; key++) {
        data.push(dataSet[key]);
      }
      return data;
    },

    // Create a function to generate a random number from min to max
    getRandomFloat: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  };
})();
