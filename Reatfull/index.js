const express = require("express");
const app = express();

const products = require("./data/products");

app.set("view engine", "ejs");

app.get("/products", (req, res) => {
    res.render("product", { products });
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});