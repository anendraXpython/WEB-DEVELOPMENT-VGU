const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 4000;

// secret used to sign cookies so they can't be tampered with on the client
app.use(cookieParser("myS3cretKey"));

app.get("/", (req, res) => {
  res.send("HOME PAGE - try /store, /cookies, /buy, /clear");
});

// sets a mix of normal and signed cookies
app.get("/store", (req, res) => {
  res.cookie("username", "govind123");
  res.cookie("theme", "dark");

  // signed cookie - Express appends a hash so we can verify it wasn't edited
  res.cookie("discount", 5000, { signed: true });

  // maxAge is in milliseconds - this one expires after 1 day
  res.cookie("lastVisit", new Date().toISOString(), {
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.send("Cookies have been set! Visit /cookies to see them.");
});

// lets us actually see what got stored, instead of guessing
app.get("/cookies", (req, res) => {
  res.json({
    normalCookies: req.cookies,
    signedCookies: req.signedCookies,
  });
});

// applies the discount only if the signed cookie is present and valid
app.get("/buy", (req, res) => {
  const price = 20000;
  const { discount } = req.signedCookies;

  const finalPrice = discount ? price - discount : price;

  res.send(
    `Original price: ${price} | Discount applied: ${discount || 0} | You pay: ${finalPrice}`
  );
});

// removes the cookies we set earlier
app.get("/clear", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("theme");
  res.clearCookie("discount");
  res.clearCookie("lastVisit");
  res.send("All cookies cleared.");
});

app.listen(PORT, () => {
  console.log(`Cookie server running at http://localhost:${PORT}`);
});
