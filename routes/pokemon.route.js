const db = require("../db/models/index");
const express = require("express");
const router = express.Router();

// route to GET /pokemons
router.get("/", async (req, res, next) => {
  try {
    const pokemons = await db.Pokemon.findAll();

    res.json(pokemons);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const pokemons = await db.Pokemon.findByPk(req.params.id);
    res.status(200).json(pokemons);
  } catch {
    error;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const pokemon = await db.Pokemon.create(req.body);
    res.status(201).json(created.toJSON());
  } catch (error) {
    next(error);
  }
});
module.exports = router;
