const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cons = require("consolidate"),
  dust = require("dustjs-helpers"),
  { Client } = require("pg"),
  app = express(),
  client = new Client({
    user: "admin",
    host: "localhost",
    database: "recipebookdb",
    password: "sagar5544",
    port: 5433
  });
client
  .connect()
  .then(() => console.log("Postgress Connected"))
  .catch(err => console.log("Error at connecting Postgress"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ url: "/", type: "get" });
});
app.listen("5000", () => {
  "Server Started";
});
