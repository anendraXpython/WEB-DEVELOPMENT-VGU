var API_BASE = "http://localhost:3000/api";

var loggedInUser = localStorage.getItem("nestlyUser");

if (!loggedInUser) {
  window.location.href = "login.html";
}

document.getElementById("userBadge").innerHTML =
  "Logged in as <strong>" + loggedInUser + "</strong> &nbsp; " +
  '<a href="#" id="logoutLink" style="color:#C9A227;">Logout</a>';

document.getElementById("logoutLink").addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("nestlyUser");
  window.location.href = "login.html";
});

var listingsGrid = document.getElementById("listingsGrid");
var resultText = document.getElementById("resultText");
var currentListings = []; // keeps the last set of listings we fetched, for the map

var selectedListingId = null;
var selectedListingTitle = null;

function fetchAndShowListings(queryParams) {
  var url = API_BASE + "/listings";
  if (queryParams) {
    url += "?" + queryParams;
  }

  resultText.innerHTML = "Loading listings...";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentListings = data;
      showListings(data);
      drawMapMarkers(data);
      populateLocationDropdown(data);
    })
    .catch(function (error) {
      resultText.innerHTML = "Could not reach the server. Is server.js running?";
      console.log("Fetch error:", error);
    });
}

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
          item.beds + ' Bedrooms, ' + item.baths + ' Bathrooms, ' + item.sqft + ' sqft<br>' +
          item.description +
        '</div>' +
      '</div>';

    var card = document.createElement("div");
    card.className = "listing-card";
    card.setAttribute("data-id", item._id);
    card.innerHTML = cardHTML;
    listingsGrid.appendChild(card);
  }

  resultText.innerHTML = data.length + " properties found (from the database)";

  var buttons = document.querySelectorAll(".viewBtn");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener("click", function () {
      var detailsBox = this.nextElementSibling;
      var card = this.closest(".listing-card");

      if (detailsBox.style.display === "block") {
        detailsBox.style.display = "none";
        this.innerHTML = "View Details";
      } else {
        detailsBox.style.display = "block";
        this.innerHTML = "Hide Details";
      }

      // remember which listing this is, so the mortgage calculator
      // can be linked to it when saved to the database
      var titleEl = card.querySelector("h3");
      selectedListingId = card.getAttribute("data-id");
      selectedListingTitle = titleEl ? titleEl.innerHTML : null;

      var calcNote = document.getElementById("calcSelectedNote");
      if (calcNote) {
        calcNote.innerHTML = "Calculating for: <strong>" + selectedListingTitle + "</strong>";
      }
    });
  }
}


function populateLocationDropdown(data) {
  var dropdown = document.getElementById("locationInput");
  var previousValue = dropdown.value;
  var uniqueLocations = [];

  for (var i = 0; i < data.length; i++) {
    if (uniqueLocations.indexOf(data[i].location) === -1) {
      uniqueLocations.push(data[i].location);
    }
  }

  dropdown.innerHTML = '<option value="">All Locations</option>';
  for (var j = 0; j < uniqueLocations.length; j++) {
    var option = document.createElement("option");
    option.value = uniqueLocations[j];
    option.innerHTML = uniqueLocations[j];
    dropdown.appendChild(option);
  }

  dropdown.value = previousValue;
}


var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function () {
  var locationValue = document.getElementById("locationInput").value;
  var maxPriceValue = document.getElementById("maxPriceInput").value;

  var params = [];
  if (locationValue !== "") {
    params.push("location=" + encodeURIComponent(locationValue));
  }
  if (maxPriceValue !== "") {
    params.push("maxPrice=" + encodeURIComponent(maxPriceValue));
  }

  fetchAndShowListings(params.join("&"));
});

var resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
  document.getElementById("locationInput").value = "";
  document.getElementById("maxPriceInput").value = "";
  fetchAndShowListings("");
});

var map = L.map("mapContainer").setView([26.92, 75.79], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

var markerGroup = L.layerGroup().addTo(map);

function drawMapMarkers(data) {
  markerGroup.clearLayers();

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var marker = L.marker([item.lat, item.lng]).addTo(markerGroup);
    marker.bindPopup("<b>" + item.title + "</b><br>$" + item.price.toLocaleString());

    marker.on("click", function (event) {
      var lat = event.latlng.lat;
      for (var k = 0; k < currentListings.length; k++) {
        if (Math.abs(currentListings[k].lat - lat) < 0.0001) {
          var targetCard = document.querySelector('[data-id="' + currentListings[k]._id + '"]');
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    });
  }
}


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


  fetch(API_BASE + "/calculations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: loggedInUser,
      listingId: selectedListingId,
      listingTitle: selectedListingTitle,
      price: price,
      rate: rate,
      years: years,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalPayable: Number(totalPayable.toFixed(2))
    })
  })
    .then(function (response) { return response.json(); })
    .then(function (data) {
      if (data.success) {
        document.getElementById("calcResult").innerHTML +=
          "<br><span style='color:#2F6F5E; font-size:13px;'>Saved to database.</span>";
      }
    })
    .catch(function (error) {
      console.log("Could not save calculation:", error);
    });
});


var socket = io("http://localhost:3000");
var chatMessages = document.getElementById("chatMessages");
var chatStatus = document.getElementById("chatStatus");

document.getElementById("chatNameInput").value = loggedInUser;

socket.on("connect", function () {
  chatStatus.innerHTML = "Connected to chat server.";
});

socket.on("disconnect", function () {
  chatStatus.innerHTML = "Disconnected from chat server.";
});

socket.on("chat message", function (data) {
  var myName = document.getElementById("chatNameInput").value || "Buyer";
  var bubble = document.createElement("div");

  if (data.name === myName) {
    bubble.className = "chat-bubble own";
  } else {
    bubble.className = "chat-bubble other";
  }

  bubble.innerHTML = "<strong>" + data.name + ":</strong> " + data.text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

var chatSendBtn = document.getElementById("chatSendBtn");
chatSendBtn.addEventListener("click", function () {
  var name = document.getElementById("chatNameInput").value;
  var messageInput = document.getElementById("chatMessageInput");
  var text = messageInput.value;

  if (name === "" || text === "") {
    alert("Please enter your name and a message.");
    return;
  }

  socket.emit("chat message", { name: name, text: text, listingId: selectedListingId });
  messageInput.value = "";
});

fetchAndShowListings("");
