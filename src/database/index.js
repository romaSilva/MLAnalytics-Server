const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Item = require("../models/Item");

const connection = new Sequelize(dbConfig);

Item.init(connection);

module.exports = connection;
