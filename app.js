require("dotenv").config();
const express = require("express");
const cookieParse = require("cookie-parser");

const app = express();
app.use(express.json());
const db = require("./db/models/index");

app.use(cookieParse());

const pokemonRouter = require("./routes/pokemon.route");
const trainerRouter = require("./routes/trainer.route");

app.use("/pokemon", pokemonRouter);
app.use("/trainer", trainerRouter);

db.sequelize.sync();

// default error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
