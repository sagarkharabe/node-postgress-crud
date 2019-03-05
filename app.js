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
  client.query("SELECT * FROM  recipes ORDER BY id ASC", (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.post("/", (req, res) => {
  const values = [req.body.name, req.body.ingredients, req.body.direction];
  client.query(
    "INSERT INTO recipes(name , ingredients , direction )VALUES($1 , $2 , $3) RETURNING id , name , ingredients ,direction",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Cannot post" });
      } else {
        console.log(result);
        res.status(201).json(result.rows[0]);
      }
    }
  );
});

app.delete("/:id", (req, res) => {
  client.query(
    `DELETE FROM recipes where id = ${req.params.id} RETURNING id`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ status: "false" });
      } else {
        console.log("Deleted row with id", result.rows[0].id);
        res.status(200).json({ status: "true" });
      }
    }
  );
});
app.put("/:id", (req, res) => {
  console.log(`"${req.body.name}"`);
  client.query(
    `UPDATE recipes SET name = $1 , ingredients = $2, direction = $3 WHERE id = ${
      req.params.id
    } returning id`,
    [req.body.name, req.body.ingredients, req.body.direction],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ status: "Not Updated" });
      } else {
        console.log("Updated row with id", result.rows[0].id);
        res.status(200).json({ status: "Updated" });
      }
    }
  );
});
app.listen("5000", () => {
  "Server Started";
});
