const express = require("express");
const fs = require("fs");
const path = require("path");

const logger = require("./middlewares/logger.middleware");
const auth = require("./middlewares/auth.middleware");
const addID = require("./middlewares/addID.middleware");

const app = express();
app.use(express.json());

// Global middleware: logs every request
app.use(logger);

// Utility: Load and Save DB
const readDB = () => JSON.parse(fs.readFileSync(path.join(__dirname, "db.json"), "utf-8"));
const writeDB = (data) => fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(data, null, 2));

// ✅ POST /add/hero
app.post("/add/hero", addID, (req, res) => {
    try {
        const db = readDB();
        db.heroes.push(req.body);
        writeDB(db);
        return res.status(200).json(db.heroes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ✅ GET /heroes
app.get("/heroes", (req, res) => {
    try {
        const db = readDB();
        return res.status(200).json(db.heroes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ✅ PATCH /update/villain/:hero_id
app.patch("/update/villain/:hero_id", (req, res) => {
    try {
        const { hero_id } = req.params;
        const newVillain = req.body;
        const db = readDB();

        const hero = db.heroes.find((h) => h.id == hero_id);

        if (!hero) {
            return res.status(404).json({ message: "Hero not found" });
        }

        // ✅ Ensure villains array exists
        if (!hero.villains) {
            hero.villains = [];
        }

        hero.villains.push(newVillain);

        writeDB(db);

        return res.status(200).json(hero);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE /delete/hero/:hero_id
app.delete("/delete/hero/:hero_id", (req, res) => {
    try {
        const { hero_id } = req.params;
        const db = readDB();
        const initialLength = db.heroes.length;

        db.heroes = db.heroes.filter((h) => h.id != hero_id);

        if (db.heroes.length === initialLength) {
            return res.status(404).json({ message: "Hero not found" });
        }

        writeDB(db);
        return res.status(200).json(db.heroes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
