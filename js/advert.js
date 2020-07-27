// File advert.js
'use strict';

(function () {
  // Property type dictionary
  var TRANSLATE_OF_ACCOMODATION = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };

  // Search template advert for a pin card
  var advertTemplate = document.querySelector('#card')
    .content.
  querySelector('.map__card'); // Ищем шаблон обявления для пина карты
  var advertElement = advertTemplate.cloneNode(true);
  var buttonPopup = advertElement.querySelector('.popup__close');
  var images = advertElement.querySelector('.popup__photos');
  var list = advertElement.querySelector('.popup__features');

  var addImages = function (array) {
    images.innerHTML = '';
    for (var i = 0; i < array.length; i++) {
      var imageItem = document.createElement('img');
      imageItem.classList.add('popup__photo');

      imageItem.src = array[i];
      imageItem.width = '45';
      imageItem.height = '40';
      imageItem.alt = 'Фотография жилья' + ' ' + (i + 1);
      images.append(imageItem);
    }
    return images;
  };

  var addFeatures = function (array) {
    list.innerHTML = '';
    for (var i = 0; i < array.length; i++) {
      var listItem = document.createElement('li');
      listItem.classList.add('popup__feature--' + array[i], 'popup__feature');
      list.prepend(listItem);
    }
    return list;
  };

  // Create advert on a map from a template
  var createAdElement = function (pattern, avatar) {
    advertElement.querySelector('.popup__title').textContent = pattern.title;
    advertElement.querySelector('.popup__text--address').textContent = pattern.address;
    advertElement.querySelector('.popup__text--price').textContent = pattern.price + ' ₽/ночь';
    advertElement.querySelector('.popup__type').textContent = TRANSLATE_OF_ACCOMODATION[pattern.type];

    advertElement.querySelector('.popup__text--capacity').textContent = pattern.rooms + (pattern.rooms === 1 ? ' комнатa для ' : ' комнаты для ') + pattern.guests + (pattern.guests === 1 ? ' гостя ' : ' гостей');
    advertElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pattern.checkin + ' выезд до ' + pattern.checkout;
    advertElement.querySelector('.popup__description').textContent = pattern.description;
    advertElement.querySelector('.popup__avatar').setAttribute('src', avatar);
  };

  // Create a function for rendering an advert
  var render = function (advertisment) {
    createAdElement(advertisment.offer, advertisment.author.avatar);

    // Add convenience to the ad card based on random
    addFeatures(advertisment.offer.features);

    // Add a photo to the ad card based on a random array
    addImages(advertisment.offer.photos);

    // Delete map__pin--active class
    var deleteActivePinClass = function () {
      var activePin = document.querySelector('.map__pin--active');
      activePin.classList.remove('map__pin--active');
    };

    // Put on a handler for closing advert
    var onPopuoCloseEscapePress = function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        deleteActivePinClass();
        window.render.deleteAdvert();
        document.removeEventListener('keydown', onPopuoCloseEscapePress);
      }
    };

    buttonPopup.addEventListener('click', function () {
      deleteActivePinClass();
      window.render.deleteAdvert();
      document.removeEventListener('keydown', onPopuoCloseEscapePress);
    });
    document.addEventListener('keydown', onPopuoCloseEscapePress);

    return advertElement;
  };

  window.advert = {
    render: render
  };
})();
