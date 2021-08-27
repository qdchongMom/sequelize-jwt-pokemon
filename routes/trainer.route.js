const db = require("../db/models/index");
const express = require("express");
const { protectRoute } = require("../middleware/protectRoute");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newTrainer = await db.Trainer.create(req.body);
    res.send(newTrainer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const trainer = await db.Trainer.scope("withoutPassword").findAll();
    res.send(trainer);
  } catch (err) {
    next(err);
  }
});

router.get("/search/:username", protectRoute, async (req, res, next) => {
  try {
    const username = req.params.username;
    const trainer = await db.Trainer.findAll({
      where: { username: { [db.Sequelize.Op.iLike]: "%" + username + "%" } },
    });
    res.send(trainer);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
