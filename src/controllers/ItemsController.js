const MeLiAPI = require("../services/MeLiAPI");
const ItemsService = require("../services/ItemsService");
const ItemsRepository = require("../database/repos/ItemsRepository");
const removeAccent = require("../utils/removeAccent");
const constants = require("../utils/constants");
const Item = require("../models/Item");
const { Op } = require("sequelize");

module.exports = {
  async index(req, res) {
    const { date } = req.body;
    const itemsResponse = await ItemsRepository.GetDatedItems(date);
    const items = itemsResponse.map((el) => el.dataValues);

    return res.json({ message: "Hello World", items });
  },

  async store(req, res) {
    const latestItem = await ItemsRepository.GetLatestItem();

    if (!ItemsService.checkLastDate(latestItem)) {
      return res.status(200).json({ message: "You just updated it :)" });
    }

    const trendsResponse = await MeLiAPI.get("trends/MLB");

    const items = trendsResponse.data.map((item, index) => {
      const newItem = new Object();
      newItem.name = removeAccent(item.keyword);
      newItem.position = index + 1;

      return newItem;
    });

    res.status(202).json({
      message: "Successful request, inserting might take a while though...",
    });

    for (let i = 0; i < items.length; i++) {
      const searchResponse = await MeLiAPI.get(
        `sites/MLB/search?q=${items[i].name}`
      );

      items[i].domain_id =
        ItemsService.findCategory(
          searchResponse.data.results,
          constants.DOMAIN
        ) || "NONE";

      items[i].category_id =
        ItemsService.findCategory(
          searchResponse.data.results,
          constants.CATEGORY
        ) || "NONE";

      items[i].price =
        +parseFloat(
          ItemsService.findAverage(searchResponse.data.results, constants.PRICE)
        ).toFixed(2) || 0;

      items[i].available =
        +parseFloat(
          ItemsService.findAverage(
            searchResponse.data.results,
            constants.AVAILABLE
          )
        ).toFixed(2) || 0;

      items[i].sold =
        +parseFloat(
          ItemsService.findAverage(searchResponse.data.results, constants.SOLD)
        ).toFixed(2) || 0;

      console.log(items[i]);
    }

    const filteredItems = ItemsService.filterCategory(items);

    await ItemsRepository.AddManyItems(filteredItems);
  },

  async updateCategoryName(req, res) {
    const itemsResponse = await ItemsRepository.GetItemsWithNullCategoryName();

    const items = itemsResponse.map((item) => item.dataValues);

    if (items.length < 1) {
      return res.status(200).json({
        message: "All updated already :)",
      });
    }

    res.status(200).json({
      message: "Successful request, inserting might take a while though...",
    });

    for (let i = 0; i < items.length; i++) {
      const categoryNameResponse = await MeLiAPI.get(
        `categories/${items[i].category_id}`
      );

      items[i].category_name = categoryNameResponse.data.name;

      console.log(items[i]);
    }

    await ItemsRepository.UpdateManyItems(items, [constants.CATEGORY_NAME]);
  },
};
