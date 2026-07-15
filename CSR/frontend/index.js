const APILINK = "http://localhost:3000/todos";
const box = document.querySelector(".box");

function displayTodos() {
    box.innerHTML = "";
    fetch(APILINK)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => {
            console.log(data.todos);
            for (let item of data.todos) {
                const para = document.createElement("p");
                para.innerText = item;
                box.appendChild(para);
            }
        });
}

displayTodos();

const btn = document.getElementById("btn");
const inp = document.getElementById("inp");

btn.addEventListener("click", async (e) => {
    let res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            todo: inp.value
        })
    });

    inp.value = "";
    displayTodos();
});
