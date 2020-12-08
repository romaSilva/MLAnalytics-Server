module.exports = function findMostOcurrences(categories) {
  return categories
    .sort(
      (a, b) =>
        categories.filter((v) => v === a).length -
        categories.filter((v) => v === b).length
    )
    .pop();
};
