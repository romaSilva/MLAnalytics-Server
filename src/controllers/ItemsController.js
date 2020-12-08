const Item = require("../models/Item");

const axios = require("axios");

const removeAccent = require("../utils/removeAccent");
const itemsService = require("../services/ItemsService");
const constants = require("../utils/constants");

module.exports = {
  async store(req, res) {
    const latestItem = await Item.findAll({
      limit: 1,
      order: [["updated_at", "DESC"]],
    });

    if (
      latestItem.length > 0 &&
      Date.now() - Date.parse(latestItem[0].dataValues.createdAt) <
        constants.MIN_TIME_TO_UPDATE
    ) {
      return res.status(200).json({ message: "You just updated it :)" });
    }

    const trendsResponse = await axios.get(
      "https://api.mercadolibre.com/trends/MLB"
    );

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
      const searchResponse = await axios.get(
        `https://api.mercadolibre.com/sites/MLB/search?q=${items[i].name}`
      );

      items[i].category = itemsService.findCategory(
        searchResponse.data.results || "NONE"
      );

      items[i].price =
        +parseFloat(
          itemsService.findAverage(searchResponse.data.results, constants.PRICE)
        ).toFixed(2) || 0;

      items[i].available =
        +parseFloat(
          itemsService.findAverage(
            searchResponse.data.results,
            constants.AVAILABLE
          )
        ).toFixed(2) || 0;

      items[i].sold =
        +parseFloat(
          itemsService.findAverage(searchResponse.data.results, constants.SOLD)
        ).toFixed(2) || 0;
      0;

      console.log("Rodando...", items[i].name);
      console.log("Categoria Encontrada...", items[i].category);
      console.log("Preço médio...", items[i].price);
      console.log("Média de disponíveis...", items[i].available);
      console.log("Média de vendidos...", items[i].sold);
      console.log("");
    }

    const filteredItems = itemsService.filterCategory(items);

    await Item.bulkCreate(filteredItems);
  },
};
