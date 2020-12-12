const Item = require("../../models/Item");
const { Op } = require("sequelize");

module.exports = {
  GetLatestItem: function () {
    return Item.findAll({
      limit: 1,
      order: [["updated_at", "DESC"]],
    });
  },

  GetItemsWithNullCategoryName: function () {
    return Item.findAll({
      where: {
        category_name: { [Op.is]: null },
      },
    });
  },

  AddManyItems: function (items) {
    return Item.bulkCreate(items);
  },

  UpdateManyItems: function (items, updateProps) {
    return Item.bulkCreate(items, {
      updateOnDuplicate: [...updateProps],
    });
  },
};
