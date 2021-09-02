require("dotenv").config();
const express = require("express");
const cookieParse = require("cookie-parser");
const path = require("path");
const apiRouter = express.Router();

const app = express();
app.use(express.json());
const db = require("./db/models/index");

app.use(cookieParse());

const pokemonRouter = require("./routes/pokemon.route");
const trainerRouter = require("./routes/trainer.route");

app.use("/api", apiRouter);
apiRouter.use("/pokemon", pokemonRouter);
apiRouter.use("/trainer", trainerRouter);

app.use(express.static(path.resolve("client", "build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve("client", "build", "index.html"))
);
db.sequelize.sync();

// default error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
