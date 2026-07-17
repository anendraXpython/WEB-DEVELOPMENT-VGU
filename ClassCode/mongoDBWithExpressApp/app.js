const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost:27017/VGU")
    .then(()=>{
        console.log("DB conected")
    })
    .catch((err)=>{
        console.log("DB not conected!", err.message)
    })

const userSChema = new mongoose.Schema({
    username:String,
    password:String,
    age:Number,
    city:String
})

const Users = mongoose.model("Users",userSChema);

app.get("/",(req,res)=>{
    res.send("Working fine!")
})


// Users.insertMany([
//     {
//         username:"ajay",
//         password:"ajay@123",
//         age:45,
//         city:"Delhi"
//     },
//     {
//         username:"teena",
//         password:"teena@123",
//         age:26,
//         city:"Noida"
//     },
//     {
//         username:"lokesh",
//         password:"lokesh@123",
//         age:19,
//         city:"Jaipur"
//     }
// ]).then(()=>{console.log("Document created!")})



// Users.find({})
//     .then((data)=>{console.log("ALL USERS:",data)});

Users.find({city:"Delhi"})
    .then((data)=>{console.log("USERS IN DELHI:",data)});

// Users.findOne({city:"Delhi"})
//     .then((data)=>{console.log("ONE USER IN DELHI:",data)});

// Users.findById("6a586a792a7c1c115416238c")
//     .then((data)=>{console.log("USER BY ID:",data)});



// Users.updateOne({},{password:"pass123"})
//     .then(()=>{console.log("Updated!")})


const PORT=4000;
app.listen(PORT,()=>{
    console.log("Server run at port",PORT);
})