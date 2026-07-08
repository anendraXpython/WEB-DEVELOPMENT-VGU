const APILINK = "https://official-joke-api.appspot.com/random_joke";

fetch(APILINK)
    .then((res) => {
        console.log(res);
        return res.json();
    })
    .then((data) => {
        console.log(data);
        
        const box = document.querySelector(".box");
        const h2 = document.createElement("h2");
        h2.innerText = "Setup: " + data.setup;
        box.appendChild(h2);

        const para = document.createElement("p");
        para.innerText = "Punchline: " + data.punchline;

        setTimeout(() => {
            para.style.color = "red";
            box.appendChild(para);
        }, 5000);
    })
    .catch((err) => {
        console.log("Error fetching joke:", err);
    });
