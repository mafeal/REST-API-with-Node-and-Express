const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser")

module.exports = () => {
   const app = express();

   app.use(bodyParser.urlencoded({extended: true})) // para receber dados de formulário via html
   app.use(bodyParser.json()) // para receber dados de qualquer fonte no formato json

   consign()
    .include("controllers")
    .into(app);

   return app
};
