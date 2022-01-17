//CustomAlerts.js
let aContainer = document.querySelector(".ac-base");
let aCBtn = document.querySelector("#ac-close");
let test2 = document.querySelector("#ub-cp");
var cnua = 1;
var nua = 0;

//Test Btns
aCBtn.addEventListener("click", closeAlert);

//Next Alert
function nextAlertNo(n) {
    alertNos(cnua += n);
}

//Show number of alerts at footer 



//Execute Alerts
function closeAlert() {
    aContainer.style.opacity = "0";
    aContainer.style.left = "-300px";
    setTimeout(function () {
        aContainer.style.display = "none";
    }, 500)
    nua = nua-1;
}

function openAlert(title, message, code) {
    aContainer.style.opacity = "1";
    aContainer.style.left = "2%";
    aContainer.style.display = "grid";
    nua = nua+1;
}


