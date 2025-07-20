const fs = require("fs");
const path = require("path");

module.exports = (req, res, next) => {
  try {
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, "../db.json"), "utf-8"));
    const heroes = db.heroes;
    const newId = heroes.length > 0 ? heroes[heroes.length - 1].id + 1 : 1;
    req.body.id = newId;
    next();
  } catch (err) {
    res.status(500).json({ error: "Failed to generate ID" });
  }
};
