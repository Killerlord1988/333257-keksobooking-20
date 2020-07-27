// File data.js
'use strict';

(function () {
  var ACCOMODATIONS = 8; // Count advert
  var TYPE_OF_ACCOMODATION = ['palace', 'flat', 'house', 'bungalo'];
  var SCHEDULE = ['12:00', '13:00', '14:00']; // Check-in - Check-out time
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator',
    'conditioner'
  ]; // Facilities
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']; // Фотографии отеля

  var locationX = document.querySelector('.map__overlay').clientWidth; // Finding the width of the map for the borders of drawing pins along the X axis

  // Template with declaration
  var getAccomodations = function (amount) {
    var accomodation = [];
    for (var i = 0; i < amount; i++) {
      var characteriscticsObject = {
        author: 'img/avatars/user0' + (i + 1) + '.png',
        offer: {
          title: 'Сдам в аренду ...',
          adress: '500, 500',
          price: window.util.getRandomFloat(0, 10000),
          type: TYPE_OF_ACCOMODATION[window.util.getRandomFloat(0, TYPE_OF_ACCOMODATION.length)],
          rooms: window.util.getRandomFloat(1, 3),
          guests: window.util.getRandomFloat(0, 2),
          checkin: SCHEDULE[window.util.getRandomFloat(0, SCHEDULE.length)],
          checkout: SCHEDULE[window.util.getRandomFloat(0, SCHEDULE.length)],
          features: window.util.getRandomData(FEATURES),
          description: 'Что-то нужно написать',
          photos: window.util.getRandomData(PHOTOS)
        },
        location: {
          x: window.util.getRandomFloat(0, locationX),
          y: window.util.getRandomFloat(130 + 81, 630) // 81 it's height of a pin
        }
      };
      accomodation[i] = characteriscticsObject;
    }
    return accomodation;
  };

  var accomodations = getAccomodations(ACCOMODATIONS);

  window.data = {
    accomodations: accomodations
  };
})();
