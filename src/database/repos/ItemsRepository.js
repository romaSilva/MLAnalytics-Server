const Item = require("../../models/Item");
const { Op } = require("sequelize");

module.exports = {
  GetLatestItem: function () {
    return Item.findAll({
      limit: 1,
      order: [["created_at", "DESC"]],
    });
  },

  GetItemsWithNullCategoryName: function () {
    return Item.findAll({
      where: {
        category_name: { [Op.is]: null },
      },
    });
  },

  GetDatedItems: function (date) {
    const nextDate = new Date(date);

    return Item.findAll({
      attributes: [
        "id",
        "name",
        "position",
        "domain_id",
        "category_name",
        "price",
        "available",
        "sold",
      ],
      where: {
        created_at: {
          [Op.between]: [date, nextDate.setDate(nextDate.getDate() + 1)],
        },
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
