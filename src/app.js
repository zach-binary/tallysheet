(function() {
  var _numMeals = 5
  var _storage = JSON.parse(window.localStorage.getItem(_getDate()));
  if (!_storage) _storage = {};
  var _views = [];

  window.addEventListener('storageupdated', function() {
    var key = _getDate();
    window.localStorage.setItem(key, JSON.stringify(_storage));
  });


  class View {
    constructor(elem, model) {
      this.elem = elem;
      this.model = model;
    }

    render() {
      this.elem.innerHTML = this.template(this.model);
    }

    template(model) { return ''; }
  }

  var TallySheet = {};
  TallySheet.View = class extends View {
    render() {
      super.render();
      var self = this;
      [].forEach.call(document.querySelectorAll('.serving-size'), function(e) {
          e.addEventListener('change', function(e) {
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

    template(model) {
      return `
        <table>
          <thead>
            <tr>
              <th></th>
              ${each(model.meals, e => `<th>Meal ${e}</th>`)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${each(model.containers, (container, row)  =>
              `<tr data-row="${row}">
                <td class="container">
                  <div class="${container.color}"></div>
                </td>
                ${each(container.meals, (m, i) =>
                  `<td>
                    <input class="serving-size" data-id="${i}" type="number" value="${m}" />
                  </td>`
                )}
                <td class="total">${container.total()}</td>
              </tr>`
            )}
          </tbody>
        </table>`;
    }
  };

  TallySheet.Model = class {
    constructor(numMeals) {
      this.containers = [
        new Container('green'),
        new Container('purple'),
        new Container('red'),
        new Container('yellow'),
        new Container('blue'),
        new Container('orange'),
        new Container('spoon')
      ];
      this.meals = range(numMeals, 1);
    }
  };

  var Pager = {};
  Pager.View = class extends View {
    template(model) {
      return `
        <a href="#/${model.previousDay}">Previous Day</a>
        <a href="#/${model.nextDay}">Next Day</a>
        <div class="selected-date">
          ${model.selectedDate}
        </div>
      `
    }
  }

  Pager.Model = class {
    constructor() {
      var date = new Date(_getDate());
      this.selectedDate = _formatDate(date);

      date.setDate(date.getDate() - 1);
      this.previousDay = _formatDate(date);

      date.setDate(date.getDate() + 2);
      this.nextDay = _formatDate(date);
    }
  };

  var Water = {};
  Water.View = class extends View {
    template(model) {
      return `
        <div>
          <label class="title">Water</label>
          ${each(model.servings, (serving, i) =>
           `<input type='checkbox' data-id="${i}" class='serving' id="water-${i}" ${serving ? "checked" : ""} />
            <label for="water-${i}"></label>`
          )}
          <input type='checkbox' id="water-completed" ${model.completed() ? "checked" : ""} />
          <label class="completed" for="water-completed"></label>
        </div>
      `;
    }

    render() {
      super.render();
      var self = this;
      [].forEach.call(this.elem.querySelectorAll('.serving'), function(elem) {
        elem.addEventListener('change', function(e) {
          var index = e.target.dataset.id;
          self.model.servings[index] = e.target.checked;
          self.elem.querySelector('#water-completed').checked = self.model.completed();
          _storage.water = self.model;
          window.dispatchEvent(new Event('storageupdated'));
        });
      })
    }
  }

  Water.Model = class {
    constructor() {
      this.servings = Array.apply(null, Array(8));
      if (_storage.water)
        this.servings = this.servings.map(function(e, i) { return _storage.water.servings[i]; });
      else
        this.servings = this.servings.map(function(e) { return false; });
    }

    completed() {
      return this.servings.every(function(e) { return e; });
    }
  }

  _views.push(new TallySheet.View(document.getElementById("tallysheet"), new TallySheet.Model(_numMeals)))
  _views.push(new Pager.View(document.getElementById("pager"), new Pager.Model()));
  _views.push(new Water.View(document.getElementById("water"), new Water.Model()));

  window.addEventListener('load', function() {
    _views.forEach(v => v.render());
  });

  window.addEventListener('hashchange', function() {
    window.location.reload();
  });

  function Container(color) {
    this.color = color;
    this.meals = Array.apply(null, Array(_numMeals)).map(function() { return ""; });
    if (_storage.tallysheet) {
      var localContainer = _storage.tallysheet.containers.filter(function(c) { return c.color == color; })[0];
      if (localContainer)
        this.meals = localContainer.meals;
    }
  }

  Container.prototype.total = function () {
    return this.meals
      .map(function(a) { return a ? a : 0 })
      .reduce(function(a, b) { return a + b; });
  }

  function _getDate() {
    var selectedDate = location.hash.substr(2);
    var d = selectedDate? new Date(selectedDate) : new Date();
    return _formatDate(d);
  }

  function _formatDate(d) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function each(arr, html) {
    return arr.map(html).join('\n');
  }

  function range(num, start) {
    if (!start) start = 0;
    return Array.apply(null, Array(num)).map(function(e, i) { return start + i; });
  }

})();
