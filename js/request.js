// File request.js
'use strict';

(function () {
  var Methods = {
    GET: 'GET',
    POST: 'POST'
  };
  var SUCCESS_CODE = 200;
  var AvatarSize = {
    WIDTH: '40',
    HEIGHT: '44'
  };
  var DefaultPaddingAvatarPreview = {
    PADDING_LEFT: '15px',
    PADDING_RIGHT: '15px'
  };
  var defaultImgSrc = 'img/muffin-grey.svg';

  var url = {
    LOAD: 'https://javascript.pages.academy/keksobooking/data',
    UPLOAD: 'https://javascript.pages.academy/keksobooking/'
  };

  var COORDS_OF_MAIN_PIN = 'left: 570px; top: 375px;';

  var form = document.querySelector('.ad-form');
  var clearFormButton = form.querySelector('.ad-form__reset');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var error = errorTemplate.cloneNode(true);

  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var success = successTemplate.cloneNode(true);

  var createQuery = function (onSuccess, onError, method, urlAddress, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, urlAddress);

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    switch (method) {
      case Methods.GET:
        xhr.send();
        break;
      case Methods.POST:
        xhr.send(data);
        break;
    }
  };

  var deletePhoto = function (container) {
    container.innerHTML = '';
  };

  var clearSrcImage = function (image) {
    var preview = document.querySelector('.ad-form-header__preview');
    preview.style.paddingLeft = DefaultPaddingAvatarPreview.PADDING_LEFT;
    preview.style.paddingRight = DefaultPaddingAvatarPreview.PADDING_RIGHT;
    image.src = defaultImgSrc;
    image.width = AvatarSize.WIDTH;
    image.height = AvatarSize.HEIGHT;
  };

  var resetForm = function () {
    var avatar = document.querySelector('.ad-form-header__preview img');
    deletePhoto(window.avatar.adContainer);
    clearSrcImage(avatar);
    form.reset();
    window.form.getMinPriceOfAccomodation();

    window.render.mapPinsContainer.prepend(window.render.overlay);
    // Find main pin and set it into the first position
    window.render.mainPin.setAttribute('style', COORDS_OF_MAIN_PIN);
    window.form.getAddress(window.form.MAIN_PIN_X_ACTIVE, window.form.MAIN_PIN_Y_ACTIVE);

    // Return form to an initial view
    window.render.map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    var advertFieldset = form.querySelectorAll('fieldset');
    advertFieldset.forEach(function (advert) {
      advert.setAttribute('disabled', 'disabled');
    });

    // Find an opened advert and close it
    window.render.deleteAdvert();

    // Find pins and delete them from map
    var pins = window.render.map.querySelectorAll('.map__pin');
    for (var j = 1; j < pins.length; j++) {
      pins[j].parentNode.removeChild(pins[j]);
    }

    // Create a handler for activating form again
    var onMapPinClick = function () {
      window.form.makeActive(advertFieldset);
      window.render.mainPin.removeEventListener('click', onMapPinClick);
    };

    // put the handler on the main pin
    window.render.mainPin.addEventListener('click', onMapPinClick);

    // reset filters on default state
    var resetFilter = function (obj) {
      Object.keys(obj).forEach(function (el) {
        obj[el].selectedIndex = 0;
        obj[el].checked = false;
      });
    };
    resetFilter(window.filter.sampleBlock);
    resetFilter(window.filter.sampleFeatures);
  };

  // Create function if there is a mistake in an uploading form
  var uploadErrorHandler = function () {
    // Add the pattern in DOM
    document.body.querySelector('main').prepend(error);

    // Find the error message to delete it
    var messageError = document.body.querySelector('main .error');

    // Create callback to delete message by click
    var onFormErrorButton = function () {
      messageError.parentNode.removeChild(messageError);
      document.removeEventListener('click', onFormErrorButton);
      document.removeEventListener('keydown', onFormErrorEscapePress);
      resetForm();
    };

    // Create callback to delete message by press Escape
    var onFormErrorEscapePress = function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        messageError.parentNode.removeChild(messageError);
        document.removeEventListener('keydown', onFormErrorEscapePress);
        document.removeEventListener('click', onFormErrorButton);
        resetForm();
      }
    };

    // Add handlers on the form
    document.addEventListener('click', onFormErrorButton);
    document.addEventListener('keydown', onFormErrorEscapePress);

    // Close an advert if it has been opened
    window.render.deleteAdvert();
  };

  //
  var uploadSuccessHandler = function () {
    // Add the pattern in DOM
    document.body.querySelector('main').prepend(success);
    var messageSuccess = document.body.querySelector('main .success');

    // Create callback to delete message by click
    var onOpenedFormSuccessClick = function (evt) {
      if (evt.target.classList.contains('success__message')) {
        return;
      };

      messageSuccess.parentNode.removeChild(messageSuccess);
      document.removeEventListener('click', onOpenedFormSuccessClick);
      document.removeEventListener('keydown', onFormSuccessEscapePress);
      resetForm();
    };

    // Create callback to delete message by press Escape
    var onFormSuccessEscapePress = function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        messageSuccess.parentNode.removeChild(messageSuccess);
        document.removeEventListener('click', onOpenedFormSuccessClick);
        document.removeEventListener('keydown', onFormSuccessEscapePress);
        resetForm();
      }
    };

    document.addEventListener('click', onOpenedFormSuccessClick);
    document.addEventListener('keydown', onFormSuccessEscapePress);

  };

  clearFormButton.addEventListener('click', resetForm);

  window.request = {
    uploadErrorHandler: uploadErrorHandler,
    uploadSuccessHandler: uploadSuccessHandler,
    createQuery: createQuery,
    url: url,
    Methods: Methods,
    error: error
  };
})();
