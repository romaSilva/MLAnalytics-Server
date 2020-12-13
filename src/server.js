const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const routes = require("./routes");
const path = require("path");

require("./database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(routes);

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "..", "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "cert", "cert.pem")),
  },
  app
);

httpsServer.listen(3333);
