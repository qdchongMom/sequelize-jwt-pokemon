const express = require("express");
const app = express();
const db = require("./db/models/index");
const pokemonRouter = require("./routes/pokemon.route");

app.use(express.json());
app.use("/pokemon", pokemonRouter);

db.sequelize.sync();

// default error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
