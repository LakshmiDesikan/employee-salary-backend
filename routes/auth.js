const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "../data.json");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ role: user.role, username });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
router.post("/change-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.users.find(u => u.username === username && u.password === oldPassword);
  if (!user) return res.status(401).json({ message: "Invalid old password" });
  user.password = newPassword;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: "Password updated" });
});
