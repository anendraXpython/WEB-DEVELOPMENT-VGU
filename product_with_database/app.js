const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

mongoose.connect("mongodb://localhost:27017/VGU-Ecom")
    .then(()=>{
        console.log("DB conected")
    })
    .catch(()=>{
        console.log("DB not conected")
    })

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("home");
})

////////////////
const productRoutes = require("./router/product");
app.use(productRoutes);

const PORT = 4000;
app.listen(PORT,()=>{
    console.log("Server run at port",PORT)
})
