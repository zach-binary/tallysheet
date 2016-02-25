'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var _numMeals = 5;
  var _storage = JSON.parse(window.localStorage.getItem(_getDate()));
  if (!_storage) _storage = {};
  var _views = [];

  window.addEventListener('storageupdated', function () {
    var key = _getDate();
    window.localStorage.setItem(key, JSON.stringify(_storage));
  });

  var View = function () {
    function View(elem, model) {
      _classCallCheck(this, View);

      this.elem = elem;
      this.model = model;
    }

    _createClass(View, [{
      key: 'render',
      value: function render() {
        this.elem.innerHTML = this.template(this.model);
      }
    }, {
      key: 'template',
      value: function template(model) {
        return '';
      }
    }]);

    return View;
  }();

  var TallySheet = {};
  TallySheet.View = function (_View) {
    _inherits(_class, _View);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'render',
      value: function render() {
        _get(Object.getPrototypeOf(_class.prototype), 'render', this).call(this);
        var self = this;
        [].forEach.call(document.querySelectorAll('.serving-size'), function (e) {
          e.addEventListener('change', function (e) {
            var index = e.target.dataset.id;
            var row = e.target.parentElement.parentElement;
            var rowNum = row.dataset.row;
            self.model.containers[rowNum].meals[index] = e.target.valueAsNumber;
            row.querySelector('td.total').innerHTML = self.model.containers[rowNum].total();
            _storage.tallysheet = self.model;
            window.dispatchEvent(new Event('storageupdated'));
          });
        });
      }
    }, {
      key: 'template',
      value: function template(model) {
        return '\n        <table>\n          <thead>\n            <tr>\n              <th></th>\n              ' + each(model.meals, function (e) {
          return '<th>Meal ' + e + '</th>';
        }) + '\n              <th>Total</th>\n            </tr>\n          </thead>\n          <tbody>\n            ' + each(model.containers, function (container, row) {
          return '<tr data-row="' + row + '">\n                <td class="container">\n                  <div class="' + container.color + '"></div>\n                </td>\n                ' + each(container.meals, function (m, i) {
            return '<td>\n                    <input class="serving-size" data-id="' + i + '" type="number" value="' + m + '" />\n                  </td>';
          }) + '\n                <td class="total">' + container.total() + '</td>\n              </tr>';
        }) + '\n          </tbody>\n        </table>';
      }
    }]);

    return _class;
  }(View);

  TallySheet.Model = function () {
    function _class2(numMeals) {
      _classCallCheck(this, _class2);

      this.containers = [new Container('green'), new Container('purple'), new Container('red'), new Container('yellow'), new Container('blue'), new Container('orange'), new Container('spoon')];
      this.meals = range(numMeals, 1);
    }

    return _class2;
  }();

  var Pager = {};
  Pager.View = function (_View2) {
    _inherits(_class3, _View2);

    function _class3() {
      _classCallCheck(this, _class3);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class3).apply(this, arguments));
    }

    _createClass(_class3, [{
      key: 'template',
      value: function template(model) {
        return '\n        <a href="#/' + model.previousDay + '">Previous Day</a>\n        <a href="#/' + model.nextDay + '">Next Day</a>\n        <div class="selected-date">\n          ' + model.selectedDate + '\n        </div>\n      ';
      }
    }]);

    return _class3;
  }(View);

  Pager.Model = function () {
    function _class4() {
      _classCallCheck(this, _class4);

      var date = new Date(_getDate());
      this.selectedDate = _formatDate(date);

      date.setDate(date.getDate() - 1);
      this.previousDay = _formatDate(date);

      date.setDate(date.getDate() + 2);
      this.nextDay = _formatDate(date);
    }

    return _class4;
  }();

  var Water = {};
  Water.View = function (_View3) {
    _inherits(_class5, _View3);

    function _class5() {
      _classCallCheck(this, _class5);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class5).apply(this, arguments));
    }

    _createClass(_class5, [{
      key: 'template',
      value: function template(model) {
        return '\n        <div>\n          <label class="title">Water</label>\n          ' + each(model.servings, function (serving, i) {
          return '<input type=\'checkbox\' data-id="' + i + '" class=\'serving\' id="water-' + i + '" ' + (serving ? "checked" : "") + ' />\n            <label for="water-' + i + '"></label>';
        }) + '\n          <input type=\'checkbox\' id="water-completed" ' + (model.completed() ? "checked" : "") + ' />\n          <label class="completed" for="water-completed"></label>\n        </div>\n      ';
      }
    }, {
      key: 'render',
      value: function render() {
        _get(Object.getPrototypeOf(_class5.prototype), 'render', this).call(this);
        var self = this;
        [].forEach.call(this.elem.querySelectorAll('.serving'), function (elem) {
          elem.addEventListener('change', function (e) {
            var index = e.target.dataset.id;
            self.model.servings[index] = e.target.checked;
            self.elem.querySelector('#water-completed').checked = self.model.completed();
            _storage.water = self.model;
            window.dispatchEvent(new Event('storageupdated'));
          });
        });
      }
    }]);

    return _class5;
  }(View);

  Water.Model = function () {
    function _class6() {
      _classCallCheck(this, _class6);

      this.servings = Array.apply(null, Array(8));
      if (_storage.water) this.servings = this.servings.map(function (e, i) {
        return _storage.water.servings[i];
      });else this.servings = this.servings.map(function (e) {
        return false;
      });
    }

    _createClass(_class6, [{
      key: 'completed',
      value: function completed() {
        return this.servings.every(function (e) {
          return e;
        });
      }
    }]);

    return _class6;
  }();

  _views.push(new TallySheet.View(document.getElementById("tallysheet"), new TallySheet.Model(_numMeals)));
  _views.push(new Pager.View(document.getElementById("pager"), new Pager.Model()));
  _views.push(new Water.View(document.getElementById("water"), new Water.Model()));

  window.addEventListener('load', function () {
    _views.forEach(function (v) {
      return v.render();
    });
  });

  window.addEventListener('hashchange', function () {
    window.location.reload();
  });

  function Container(color) {
    this.color = color;
    this.meals = Array.apply(null, Array(_numMeals)).map(function () {
      return "";
    });
    if (_storage.tallysheet) {
      var localContainer = _storage.tallysheet.containers.filter(function (c) {
        return c.color == color;
      })[0];
      if (localContainer) this.meals = localContainer.meals;
    }
  }

  Container.prototype.total = function () {
    return this.meals.map(function (a) {
      return a ? a : 0;
    }).reduce(function (a, b) {
      return a + b;
    });
  };

  function _getDate() {
    var selectedDate = location.hash.substr(2);
    var d = selectedDate ? new Date(selectedDate) : new Date();
    return _formatDate(d);
  }

  function _formatDate(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function each(arr, html) {
    return arr.map(html).join('\n');
  }

  function range(num, start) {
    if (!start) start = 0;
    return Array.apply(null, Array(num)).map(function (e, i) {
      return start + i;
    });
  }
})();
