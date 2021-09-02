const db = require("../db/models/index");
const express = require("express");
const { protectRoute } = require("../middleware/auth");
const createJWTToken = require("../config/jwt");
const bcrypt = require("bcryptjs");
const trainer = require("../db/models/trainer");

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
    const trainer = await db.Trainer.scope("withoutPassword").findAll({
      where: { username: { [db.Sequelize.Op.iLike]: "%" + username + "%" } },
    });
    res.send(trainer);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/:id/pokemons", protectRoute, async (req, res, next) => {
  try {
    const trainerId = req.params.id;
    const trainer = await db.Trainer.findOne({
      where: {
        id: trainerId,
      },
      include: {
        model: db.Pokemon,
      },
    });
    console.log(trainer.Pokemons[0].name);
    res.json(trainer);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const trainer = await db.Trainer.findOne({
      attributes: { include: ["password"] },
      where: { username },
    });

    if (!trainer) {
      return res.status(422).json({ message: "Invalid username or password" });
    }

    const result = await bcrypt.compare(password, trainer.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(trainer.username);
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true,
      secure: true,
    });

    res.send("You are now logged in!");
  } catch (error) {
    if (error.message === "Login failed") {
      error.statusCode = 400;
    }
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});
module.exports = router;
