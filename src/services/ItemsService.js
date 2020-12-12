const findMostOccurrences = require("../utils/findMostOccurrences");
const constants = require("../utils/constants");

module.exports = {
  findCategory: function (results, prop) {
    const foundCategories = [];

    results.forEach((result) => {
      if (prop === constants.DOMAIN) {
        foundCategories.push(result.domain_id);
      } else if (prop === constants.CATEGORY) {
        foundCategories.push(result.category_id);
      }
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
        item.domain_id !== "MLB-CARS_AND_VANS" &&
        item.domain_id !== "MLB-CLASSIC_CARS" &&
        item.domain_id !== "MLB-TRUCKS"
    );
    return filteredItems;
  },

  checkLastDate: function (latestItem) {
    if (
      latestItem.length > 0 &&
      Date.now() - Date.parse(latestItem[0].dataValues.createdAt) <
        constants.MIN_TIME_TO_UPDATE
    ) {
      return false;
    }
    return true;
  },
};
