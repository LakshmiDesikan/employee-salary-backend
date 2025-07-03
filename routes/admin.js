const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "../data.json");

router.post("/create-user", (req, res) => {
  const { username, password } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath));
  if (data.users.length >= 6) {
    return res.status(400).json({ message: "Maximum 6 users allowed" });
  }
  if (data.users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  data.users.push({
    username,
    password,
    role: "user",
    salaryStatus: {
      date: null,
      isCredited: false
    }
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: "User created" });
});

router.post("/set-salary", (req, res) => {
  const { username, date, isCredited } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.users.find(u => u.username === username && u.role === "user");
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  user.salaryStatus = { date, isCredited };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: "Status updated" });
});

router.get("/list-users", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data.users.filter(u => u.role === "user"));
});

module.exports = router;
