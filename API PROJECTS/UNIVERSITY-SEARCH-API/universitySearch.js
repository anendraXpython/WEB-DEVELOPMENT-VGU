const BASE_URL = "http://universities.hipolabs.com/search?country=";

const searchBtn = document.getElementById("searchBtn");
const countryInput = document.getElementById("countryInput");
const tableBody = document.getElementById("universityTableBody");

function searchUniversities() {
    const countryValue = countryInput.value.trim();
    
    if (countryValue === "") {
        alert("Please enter a country name!");
        return;
    }

    tableBody.innerHTML = `<tr><td colspan="3">Loading...</td></tr>`;

    const dynamicApiLink = BASE_URL + countryValue;

    fetch(dynamicApiLink)
        .then((res) => res.json())
        .then((data) => {
            tableBody.innerHTML = ""; 

            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3">No universities found for this country.</td></tr>`;
                return;
            }

            data.forEach((university) => {
                const row = document.createElement("tr");

                const nameCell = document.createElement("td");
                nameCell.textContent = university.name || "";

                const stateCell = document.createElement("td");
                stateCell.textContent = university["state-province"] || "";

                const webCell = document.createElement("td");
                if (university.web_pages && university.web_pages.length > 0) {
                    const link = document.createElement("a");
                    link.href = university.web_pages[0];
                    link.target = "_blank"; // Opens in a new tab
                    link.textContent = university.web_pages[0];
                    webCell.appendChild(link);
                } else {
                    webCell.textContent = "";
                }

                row.appendChild(nameCell);
                row.appendChild(stateCell);
                row.appendChild(webCell);
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            tableBody.innerHTML = `<tr><td colspan="3" style="color: red;">Failed to fetch data. Please try again.</td></tr>`;
        });
}

searchBtn.addEventListener("click", searchUniversities);

countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchUniversities();
    }
});
