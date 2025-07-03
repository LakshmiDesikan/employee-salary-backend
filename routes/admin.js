const backendURL = "https://employee-salary-backend.onrender.com";

// Refresh and load all users
function refresh() {
  fetch(`${backendURL}/api/admin/list-users`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      data.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `${user.username} — `;

        // Date input
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = user.salaryStatus?.date || "";
        li.appendChild(dateInput);

        // Checkbox for isCredited
        const creditCheckbox = document.createElement("input");
        creditCheckbox.type = "checkbox";
        creditCheckbox.checked = user.salaryStatus?.isCredited || false;
        li.appendChild(creditCheckbox);

        // Set button
        const setBtn = document.createElement("button");
        setBtn.innerText = "Set";
        setBtn.onclick = () => {
          const payload = {
            username: user.username,
            date: dateInput.value,
            isCredited: creditCheckbox.checked
          };
          fetch(`${backendURL}/api/admin/set-salary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(result => {
            alert(result.message);
            refresh();
          })
          .catch(err => {
            console.error("Set salary failed:", err);
            alert("Failed to set salary");
          });
        };

        li.appendChild(setBtn);
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Error loading user list:", err);
      document.getElementById("list").innerText = "Error loading users.";
    });
}

// Create user
function createUser() {
  const username = document.getElementById("newu").value;
  const password = document.getElementById("newp").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;

  if (!username || !password || !email || !role) {
    alert("Please fill all fields");
    return;
  }

  fetch(`${backendURL}/api/admin/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role, email })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("res").innerText = data.message;
      refresh();
    })
    .catch(err => {
      console.error("Create user error:", err);
      alert("Error creating user");
    });
}

// Change password
function changePassword() {
  const oldPassword = document.getElementById("oldPass").value;
  const newPassword = document.getElementById("newPass").value;
  const username = sessionStorage.getItem("user");

  if (!oldPassword || !newPassword) {
    alert("Enter both old and new passwords");
    return;
  }

  fetch(`${backendURL}/api/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, oldPassword, newPassword })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
    })
    .catch(err => {
      console.error("Change password failed:", err);
      alert("Password update failed");
    });
}

// Reset all users (keep admin)
function resetAll() {
  fetch(`${backendURL}/api/admin/reset`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      refresh(); // reload list
    })
    .catch(err => {
      console.error("Reset failed:", err);
      alert("Reset failed");
    });
}

// Toggle dark mode
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Logout
function logout() {
  sessionStorage.clear();
  location.href = "index.html"; // go to login
}

// Initial load
window.onload = refresh;
