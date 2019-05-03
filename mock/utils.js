function findIndex(list, predicate) {
  var value;
  for (var i = 0; i < list.length; i++) {
    value = list[i];
    if (predicate(value, i, list))
      return i;
  }
  return -1;
}

module.exports = {
  getById: function (id, list) {
    return list[findIndex(list, function (value) {
      return value.id == id;
    })];
  },
  setById: function (id, list, newValue) {
    var index = findIndex(list, function (value) {
      return value.id == id;
    });
    if (index >= 0) {
      list[index] = newValue;
    } else {
      list.push(newValue);
    }
  },
  findIndex: findIndex,
}
