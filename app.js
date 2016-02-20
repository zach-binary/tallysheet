(function() {
  var numMeals = 5
  var model = {
    containers: [
      new Container("blue"),
      new Container("purple")
    ],
    meals: range(5, 1)
  };

  function Container(color) {
    this.color = color;
    this.meals = _initMeals(numMeals);
  }

  Container.prototype.total = function () {
    return this.meals
      .map(function(a) { return a ? a : 0 })
      .reduce(function(a, b) { return a + b; });
  }

  function _initMeals(count) {
    var meals = [];
    for(var i = 0; i < count; i++)
      meals[i] = "";

    return meals;
  }

  var tallysheet = document.getElementById("tallysheet");

  renderTallysheet();

  [].forEach.call(document.querySelectorAll('.serving-size'), function(e) {
      e.addEventListener('change', function(e) {
        var index = e.target.dataset.id;
        var row = e.target.parentElement.parentElement;
        var rowNum = row.dataset.row;
        model.containers[rowNum].meals[index] = e.target.valueAsNumber;
        row.querySelector('td.total').innerHTML = model.containers[rowNum].total();
      });
  });

  function renderTallysheet() {
    var tallysheetHtml = _tallysheet_template(model);
    tallysheet.innerHTML = tallysheetHtml;
  }

  function _tallysheet_template(model) {
    return `<table>
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
            <td class="${container.color}"</td>
            ${each(container.meals, (m, i) =>
              `<td>
                <input class="serving-size" data-id="${i}" type="number" value="${m}" />
              </td>`
            )}
            <td class="total">${container.total()}</td>
          </tr>`
        )}
      </tbody>
    </table>`
  }

  function each(arr, html) {
    return arr.map(html).join('\n');
  }

  function range(num, start) {
    if (!start) start = 0;
    return Array.apply(null, Array(num)).map(function(e, i) { return start + i; });
  }

})();
