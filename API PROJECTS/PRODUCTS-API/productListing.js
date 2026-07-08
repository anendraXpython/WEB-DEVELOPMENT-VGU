const ALL_PRODUCTS_URL = "https://dummyjson.com/products";
const SEARCH_PRODUCTS_URL = "https://dummyjson.com/products/search?q=";

const searchBtn = document.getElementById("searchBtn");
const productInput = document.getElementById("productInput");
const productGrid = document.getElementById("productGrid");
const sortSelect = document.getElementById("sortSelect");

let myProducts = []; 

function loadProducts(url) {
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            myProducts = data.products; 
            displayProducts(myProducts); 
        });
}

function displayProducts(productsList) {
    productGrid.innerHTML = ""; 

    if (productsList.length === 0) {
        productGrid.innerHTML = "<p>No products found.</p>";
        return;
    }

    for (let i = 0; i < productsList.length; i++) {
        let currentItem = productsList[i];

        let card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${currentItem.thumbnail}">
            <h3>${currentItem.title}</h3>
            <p class="price">$${currentItem.price}</p>
            <p class="rating">⭐ ${currentItem.rating}</p>
        `;

        productGrid.appendChild(card);
    }
}

searchBtn.addEventListener("click", function() {
    let userInput = productInput.value.trim();

    if (userInput === "") {
        alert("Search field cannot be empty!");
        return; 
    }

    sortSelect.value = "default"; 
    loadProducts(SEARCH_PRODUCTS_URL + userInput); 
});


sortSelect.addEventListener("change", function() {
    let chosenOption = sortSelect.value;

    if (chosenOption === "low-to-high") {
        myProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    } 
    else if (chosenOption === "high-to-low") {
        myProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    }
    else if (chosenOption === "rating-low-to-high") {
        myProducts.sort(function(a, b) {
            return a.rating - b.rating;
        });
    }
    else if (chosenOption === "rating-high-to-low") {
        myProducts.sort(function(a, b) {
            return b.rating - a.rating;
        });
    }

    displayProducts(myProducts); 
});


loadProducts(ALL_PRODUCTS_URL);
