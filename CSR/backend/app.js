const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const todos = ["Game", "Dance", "music", "cricket"];

app.get("/todos", (req, res) => {
    res.json({ todos });
});

///

app.post("/todos", (req, res) => {
    let data = req.body.todo;
    todos.push(data);

    res.send("ok");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server run at port", PORT);
});
