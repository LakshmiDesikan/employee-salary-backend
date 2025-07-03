const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const sendEmail = require("../mailer");

const filePath = path.join(__dirname, "../data.json");

// ✅ Create new user (max 6)
router.post("/create-user", (req, res) => {
  const { username, password, role, email } = req.body;

  const data = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : { users: [] };

  if (data.users.length >= 6) {
    return res.status(400).json({ message: "Maximum 6 users allowed" });
  }

  if (data.users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = {
    username,
    password,
    role: role || "user",
    email,
    salaryStatus: { date: null, isCredited: false }
  };

  data.users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // ✅ Send welcome email
  sendEmail(email, "Welcome to Salary App", `Hi ${username}, your account is created!`);

  res.json({ message: "User created successfully" });
});

// ✅ Set salary status for user
router.post("/set-salary", (req, res) => {
  const { username, date, isCredited } = req.body;

  const data = JSON.parse(fs.readFileSync(filePath));
  const user = data.users.find(u => u.username === username && u.role === "user");

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  user.salaryStatus = { date, isCredited };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Salary status updated" });
});

// ✅ Get user list (only normal users)
router.get("/list-users", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data.users.filter(u => u.role === "user"));
});

// ✅ Reset all users (keep only admin)
router.post("/reset", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const onlyAdmin = data.users.filter(u => u.role === "admin");
  fs.writeFileSync(filePath, JSON.stringify({ users: onlyAdmin }, null, 2));
  res.json({ message: "All user data reset" });
});

module.exports = router;
