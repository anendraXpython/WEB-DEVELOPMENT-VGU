const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 4000;

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // session lives for 1 hour
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("HOME PAGE - try /login, /dashboard, /logout");
});

// creates a session for the "user"
app.get("/login", (req, res) => {
  req.session.user = "govind123";
  req.session.loggedInAt = new Date().toLocaleTimeString();
  res.send(`Logged in! Session started at ${req.session.loggedInAt}`);
});

// only accessible if a session with a logged-in user exists
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("You must /login first.");
  }

  res.send(
    `Welcome back, ${req.session.user}. You logged in at ${req.session.loggedInAt}`
  );
});

// destroys the session, effectively "logging out"
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error while logging out.");
    }
    res.send("Logged out. Session destroyed.");
  });
});

app.listen(PORT, () => {
  console.log(`Session server running at http://localhost:${PORT}`);
});
