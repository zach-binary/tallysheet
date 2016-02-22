'use strict';

(function () {
  var _numMeals = 5;
  var _localModel = JSON.parse(window.localStorage.getItem(_getDate()));
  var _views = [];

  var TallySheet = {};
  _views.push(TallySheet);

  TallySheet.Model = function (numMeals) {
    this.containers = [new Container('green'), new Container('purple'), new Container('red'), new Container('yellow'), new Container('blue'), new Container('orange'), new Container('spoon')];
    this.meals = range(numMeals, 1);
  };

  TallySheet.render = function () {
    _localModel = JSON.parse(window.localStorage.getItem(_getDate()));
    var model = new TallySheet.Model(_numMeals);
    TallySheet.elem.innerHTML = TallySheet.template(model);

    [].forEach.call(document.querySelectorAll('.serving-size'), function (e) {
      e.addEventListener('change', function (e) {
        var index = e.target.dataset.id;
        var row = e.target.parentElement.parentElement;
        var rowNum = row.dataset.row;
        model.containers[rowNum].meals[index] = e.target.valueAsNumber;
        row.querySelector('td.total').innerHTML = model.containers[rowNum].total();
        tallysheet.dispatchEvent(new Event('update'));
      });
    });
  };

  TallySheet.template = function (model) {
    return '\n      <table>\n        <thead>\n          <tr>\n            <th></th>\n            ' + each(model.meals, function (e) {
      return '<th>Meal ' + e + '</th>';
    }) + '\n            <th>Total</th>\n          </tr>\n        </thead>\n        <tbody>\n          ' + each(model.containers, function (container, row) {
      return '<tr data-row="' + row + '">\n              <td class="container">\n                <div class="' + container.color + '"></div>\n              </td>\n              ' + each(container.meals, function (m, i) {
        return '<td>\n                  <input class="serving-size" data-id="' + i + '" type="number" value="' + m + '" />\n                </td>';
      }) + '\n              <td class="total">' + container.total() + '</td>\n            </tr>';
    }) + '\n        </tbody>\n      </table>';
  };

  TallySheet.elem = document.getElementById("tallysheet");
  TallySheet.elem.addEventListener('update', function (e) {
    var key = _getDate();
    window.localStorage.setItem(key, JSON.stringify(model));
  });

  var Pager = {};
  _views.push(Pager);

  Pager.Model = function () {
    var date = new Date(_getDate());
    this.selectedDate = _formatDate(date);

    date.setDate(date.getDate() - 1);
    this.previousDay = _formatDate(date);

    date.setDate(date.getDate() + 2);
    this.nextDay = _formatDate(date);
  };

  Pager.render = function () {
    var model = new Pager.Model();
    Pager.elem.innerHTML = Pager.template(model);
  };

  Pager.template = function (model) {
    return '\n      <a href="#/' + model.previousDay + '">Previous Day</a>\n      <a href="#/' + model.nextDay + '">Next Day</a>\n      <div class="selected-date">\n        ' + model.selectedDate + '\n      </div>\n    ';
  };

  Pager.elem = document.getElementById("pager");

  window.addEventListener('load', function () {
    _renderViews();
  });

  window.addEventListener('hashchange', function () {
    _renderViews();
  });

  function Container(color) {
    this.color = color;
    this.meals = Array.apply(null, Array(_numMeals)).map(function () {
      return "";
    });
    if (_localModel) {
      var localContainer = _localModel.containers.filter(function (c) {
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

  function _renderViews() {
    _views.forEach(function (v) {
      v.render();
    });
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
