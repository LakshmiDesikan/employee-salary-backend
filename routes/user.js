const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "../data.json");

router.get("/status/:username", (req, res) => {
  const username = req.params.username;
  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.users.find(u => u.username === username && u.role === "user");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.salaryStatus);
});

module.exports = router;
