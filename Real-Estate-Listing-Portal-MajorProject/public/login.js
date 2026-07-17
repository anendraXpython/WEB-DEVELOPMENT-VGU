var API_BASE = "http://localhost:3000/api";

// if already logged in, skip straight to the main site
if (localStorage.getItem("nestlyUser")) {
  window.location.href = "majorProjectSunstone.html";
}

var authMessage = document.getElementById("authMessage");

function showMessage(text, isError) {
  authMessage.innerHTML = text;
  authMessage.style.color = isError ? "crimson" : "#2F6F5E";
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var username = document.getElementById("loginUsername").value;
  var email = document.getElementById("loginEmail").value;

  fetch(API_BASE + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, email: email })
  })
    .then(function (response) { return response.json(); })
    .then(function (data) {
      if (data.success) {
        localStorage.setItem("nestlyUser", data.username);
        window.location.href = "majorProjectSunstone.html";
      } else {
        showMessage(data.error || "Something went wrong.", true);
      }
    })
    .catch(function () {
      showMessage("Could not reach the server. Is server.js running?", true);
    });
});
