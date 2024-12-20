import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res) => {
  const filePath = "output.json";
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Datoteka nije pronađena." });
  }
});

export default router;
