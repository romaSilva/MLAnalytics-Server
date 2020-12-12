const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.mercadolibre.com/",
});

module.exports = api;
