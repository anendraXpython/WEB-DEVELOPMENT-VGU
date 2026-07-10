const calcBtn = document.getElementById("calcBtn");
const calcResult = document.getElementById("calcResult");

calcBtn.addEventListener("click", () => {

    const price = Number(document.getElementById("calcPrice").value);
    const rate = Number(document.getElementById("calcRate").value);
    const years = Number(document.getElementById("calcYears").value);

    const r = rate / 12 / 100;

    const n = years * 12;

    const monthlyPayment =
        (price * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1);

    calcResult.innerText =
        `Monthly Payment: $${monthlyPayment.toFixed(2)}`;
});
