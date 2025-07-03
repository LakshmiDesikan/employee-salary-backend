const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "../data.json");
const sendEmail = require("../mailer");


router.post("/create-user", (req, res) => {
 const newUser = { username, password, role, email };
 const usersPath = path.join(__dirname, "../users.json");
  let users = [];

  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath));
  }

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
   // ✅ Send welcome email after successful creation
  sendEmail(newUser.email, "Welcome to Salary App", `Hi ${newUser.username}, your account is created!`);

  res.json({ message: "User created successfully" });
  const { username, password ,role,email} = req.body;
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
router.post("/reset", (req, res) => {
  const data = { users: [data.users[0]] }; // keep only admin
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: "All user data reset" });
});
function createUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;

  fetch("https://your-backend-url.onrender.com/api/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role, email }),
  })
  .then(res => res.json())
  .then(data => alert(data.message || "User created"))
  .catch(err => alert("Error creating user"));
}
function setSalary() {
  const username = document.getElementById("salaryUser").value;
  const status = document.getElementById("status").value;

  fetch("https://your-backend-url.onrender.com/api/admin/set-salary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, status }),
  })
  .then(res => res.json())
  .then(data => alert(data.message || "Salary status updated"))
  .catch(err => alert("Error setting salary status"));
}



