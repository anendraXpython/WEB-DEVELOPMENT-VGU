const express = require("express");
const methodOverride = require("method-override");

const products02 = require("./data/products02");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/product02", (req, res) => {
    res.render("product02", {
        products: products02.getAll(),
    });
});

app.get("/product02/new", (req, res) => {
    res.render("new-product");
});

app.post("/product02/new", (req, res) => {
    products02.add(req.body);
    res.redirect("/product02");
});

app.get("/product02/:id/edit", (req, res) => {
    const id = Number(req.params.id);

    const product = products02
        .getAll()
        .find((item) => item.id === id);

    res.render("edit", { product });
});

app.put("/product02/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products02
        .getAll()
        .find((item) => item.id === id);

    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.desc = req.body.desc;
    }

    res.redirect("/product02");
});

app.delete("/product02/:id", (req, res) => {

    const id = Number(req.params.id);

    products02.remove(id);

    res.redirect("/product02");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});