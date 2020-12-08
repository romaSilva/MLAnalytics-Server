const express = require("express");
const routes = express.Router();

const ItemsController = require("./controllers/ItemsController");

routes.post("/items", ItemsController.store);

module.exports = routes;
