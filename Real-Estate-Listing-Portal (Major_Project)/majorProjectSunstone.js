var listings = [
  {
    title: "Maple Court Bungalow",
    location: "Rowanwood",
    price: 385000,
    beds: 3,
    baths: 2,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "The Elmhurst Loft",
    location: "Elm District",
    price: 612000,
    beds: 2,
    baths: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Birchwood Family Home",
    location: "Rowanwood",
    price: 745000,
    beds: 4,
    baths: 3,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Harborview Apartment",
    location: "Old Harbor",
    price: 528000,
    beds: 2,
    baths: 1,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Cedarbrook Cottage",
    location: "Elm District",
    price: 299000,
    beds: 1,
    baths: 1,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Sycamore Grove Villa",
    location: "Old Harbor",
    price: 899000,
    beds: 5,
    baths: 4,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=500&q=60"
  }
];

var listingsGrid = document.getElementById("listingsGrid");
var resultText = document.getElementById("resultText");

function showListings(data) {
  listingsGrid.innerHTML = "";

  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    var cardHTML =
      '<img src="' + item.image + '" alt="' + item.title + '">' +
      '<div class="card-body">' +
        '<p class="price">$' + item.price.toLocaleString() + '</p>' +
        '<h3>' + item.title + '</h3>' +
        '<p>' + item.location + '</p>' +
        '<button class="viewBtn">View Details</button>' +
        '<div class="details">' +
          item.beds + ' Bedrooms, ' + item.baths + ' Bathrooms<br>' +
          'Located in ' + item.location + '.' +
        '</div>' +
      '</div>';

    var card = document.createElement("div");
    card.className = "listing-card";
    card.innerHTML = cardHTML;
    listingsGrid.appendChild(card);
  }

  resultText.innerHTML = data.length + " properties found";

  var buttons = document.querySelectorAll(".viewBtn");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener("click", function () {
      var detailsBox = this.nextElementSibling;
      if (detailsBox.style.display === "block") {
        detailsBox.style.display = "none";
        this.innerHTML = "View Details";
      } else {
        detailsBox.style.display = "block";
        this.innerHTML = "Hide Details";
      }
    });
  }
}

var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
  var locationValue = document.getElementById("locationInput").value.toLowerCase();
  var maxPriceValue = document.getElementById("maxPriceInput").value;

  if (maxPriceValue === "") {
    maxPriceValue = 999999999;
  } else {
    maxPriceValue = Number(maxPriceValue);
  }

  var filteredListings = [];

  for (var i = 0; i < listings.length; i++) {
    var item = listings[i];
    var locationMatches = item.location.toLowerCase().indexOf(locationValue) !== -1;
    var priceMatches = item.price <= maxPriceValue;

    if (locationMatches && priceMatches) {
      filteredListings.push(item);
    }
  }

  showListings(filteredListings);
});

var resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
  document.getElementById("locationInput").value = "";
  document.getElementById("maxPriceInput").value = "";
  showListings(listings);
});

var calcBtn = document.getElementById("calcBtn");
calcBtn.addEventListener("click", function () {
  var price = Number(document.getElementById("calcPrice").value);
  var rate = Number(document.getElementById("calcRate").value);
  var years = Number(document.getElementById("calcYears").value);


  var totalInterest = price * (rate / 100) * years;
  var totalPayable = price + totalInterest;
  var totalMonths = years * 12;
  var monthlyPayment = totalPayable / totalMonths;

  document.getElementById("calcResult").innerHTML =
    "Estimated monthly payment: $" + monthlyPayment.toFixed(2) +
    " (total payable over " + years + " years: $" + totalPayable.toFixed(2) + ")";
});

var contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from refreshing

  var name = document.getElementById("nameInput").value;
  var email = document.getElementById("emailInput").value;
  var message = document.getElementById("messageInput").value;

  if (name === "" || email === "" || message === "") {
    document.getElementById("formResult").innerHTML = "Please fill in every field before sending.";
  } else {
    document.getElementById("formResult").innerHTML = "Thanks " + name + ", your message has been sent to the agent!";
    contactForm.reset();
  }
});

showListings(listings);
