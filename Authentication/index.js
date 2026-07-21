const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Users = require("./models/users");

mongoose.connect("mongodb://localhost:27017/VGU_AUTH")
    .then(()=>{console.log("DB conected!")})
    .catch(()=>{console.log("DB not conected!")})

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret: "vgu_auth_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Middleware: only let logged-in users through
function isLoggedIn(req, res, next){
    if(req.session.user){
        return next();
    }
    res.redirect("/login");
}

app.get("/",(req,res)=>{
    if(req.session.user){
        return res.redirect("/home");
    }
    res.redirect("/login");
})

app.get("/home", isLoggedIn, (req,res)=>{
    res.render("home", { username: req.session.user.username });
})

app.get("/signup",(req,res)=>{
    res.render("signup", { error: null });
})

app.get("/login",(req,res)=>{
    res.render("login", { error: null });
})

app.post("/signup", async (req,res)=>{
    try{
        const {username,password,email} = req.body;

        const existingUser = await Users.findOne({ username });
        if(existingUser){
            return res.render("signup", { error: "That username is already taken." });
        }

        const hashPassword = await bcrypt.hash(password,10);
        await Users.create({ username, password: hashPassword, email });
        res.redirect("/login");
    } catch(err){
        console.log(err);
        res.render("signup", { error: "Something went wrong. Please try again." });
    }
})

app.post("/login", async (req,res)=>{
    try{
        const {username,password} = req.body;

        const user = await Users.findOne({ username });
        if(!user){
            return res.render("login", { error: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.render("login", { error: "Invalid username or password." });
        }

        req.session.user = { id: user._id, username: user.username };
        res.redirect("/home");
    } catch(err){
        console.log(err);
        res.render("login", { error: "Something went wrong. Please try again." });
    }
})

app.get("/logout", (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
})

const PORT = 4000;
app.listen(PORT,()=>{
    console.log("Server run at port",PORT)
});
