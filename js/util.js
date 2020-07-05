// File util.js
'use strict';

(function () {
  window.util = {
    ENT_CODE: 13, // Keycode of enter button
    ECS_CODE: 27, // Keycode of escape button

    // Генерация рандомного массива
    getRandomData: function (dataSet) {

      // Генерируем рандомную длинну массива
      var randomNumber = this.getRandomFloat(0, dataSet.length);
      var data = [];
      // Записываем в рандомный массив данные из массива переданного в параметр
      for (var key = 0; key < randomNumber; key++) {
        data.push(dataSet[key]);
      }
      return data;
    },

    // Создаем функцию для генерации случайного числа от min до max
    getRandomFloat: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  };
})();
