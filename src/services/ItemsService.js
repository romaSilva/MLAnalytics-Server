const findMostOccurrences = require("../utils/findMostOccurrences");
const constants = require("../utils/constants");

module.exports = {
  findCategory: function (results) {
    const foundCategories = [];

    results.forEach((result) => {
      foundCategories.push(result.domain_id);
    });

    return findMostOccurrences(foundCategories);
  },
  findAverage: function (results, prop) {
    let sum = 0;

    results.forEach((result) => {
      if (prop === constants.PRICE) {
        sum += result.price;
      } else if (prop === constants.AVAILABLE) {
        sum += result.available_quantity;
      } else if (prop === constants.SOLD) {
        sum += result.sold_quantity;
      }
    });

    return sum / results.length;
  },
  filterCategory: function (items) {
    const filteredItems = items.filter(
      (item) =>
        item.category !== "MLB-CARS_AND_VANS" &&
        item.category !== "MLB-CLASSIC_CARS" &&
        item.category !== "MLB-TRUCKS"
    );
    return filteredItems;
  },
};
