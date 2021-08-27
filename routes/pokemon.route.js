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
    const pokemon = await db.Pokemon.findByPk(req.params.id);
    if (pokemon === null) {
      res.sendStatus(404);
    } else {
      res.status(200).json(pokemon);
    }
  } catch {
    error;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const pokemon = await db.Pokemon.create(req.body);
    res.status(201).json(pokemon.toJSON());
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const reqBody = req.body;

    const [numOfUpdatedRecord, updatedRecord] = await db.Pokemon.update(
      reqBody,
      {
        where: {
          id: id,
        },
        returning: true,
      }
    );
    res.json({
      message: `Updated ${numOfUpdatedRecord} records successfully!`,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedPokemon = await db.Pokemon.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ deletedRecordsCount: deletedPokemon });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
