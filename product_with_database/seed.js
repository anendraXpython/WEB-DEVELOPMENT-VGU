const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/VGU-Ecom")
    .then(()=>{
        console.log("DB conected")
    })
    .catch(()=>{
        console.log("DB not conected")
    })

const Products = require("./models/product");

// NOTE: replace with your real product list. Using picsum.photos here
// since it reliably serves real images (unlike via.placeholder.com).
const data = [
    {
        name:"Phone",
        price:100,
        image:"https://picsum.photos/id/1/400/300",
        desc:"a portable, handheld device that connects to wireless networks via radio waves to facilitate voice calls, text messaging, and internet access"
    },
    {
        name:"Laptop",
        price:150,
        image:"https://picsum.photos/id/48/400/300",
        desc:"a portable computer suitable for use while traveling"
    },
    {
        name:"Drone",
        price:70,
        image:"https://picsum.photos/id/96/400/300",
        desc:"an unmanned aerial vehicle used for photography and recreation"
    },
    {
        name:"Keyboard",
        price:30,
        image:"https://picsum.photos/id/60/400/300",
        desc:"an input device used to enter characters into a computer"
    }
];

Products.deleteMany({})
    .then(()=>{
        return Products.create(data);
    })
    .then(()=>{console.log("Product seeded to database")})
