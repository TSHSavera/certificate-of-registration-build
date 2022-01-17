//dashboard.js


//Sidenav
//Variables
let sn_v = 0;
let snop = document.getElementById("sn-op-btn");
//Event Listener
snop.onclick = openSn;
//Function
function openSn() {
    let a = document.querySelector(".sidenav");
    let b = document.querySelector(".dashboard");
    let c = document.querySelector(".logo-1");
    let d = document.querySelector(".logo-2");
    
    if (sn_v == 0) {
        while (sn_v < 1) {
            c.style.display = "none";
            d.style.display = "block";
            a.style.width = "20%";
            b.style.marginLeft = "20%";
            b.style.width = "80%";
            sn_v = sn_v + 1;
        }
    }
    else if (sn_v == 1) {
            c.style.display = "block";
            d.style.display = "none";
            a.style.width = "0";
            b.style.marginLeft = "0";
            b.style.width = "100%";
            sn_v = sn_v - 1;
    }
    else {
        console.log("Loop error");
        console.log(sn_v);
    }
    
}

//Sidenav end

//Set Data obtained from DB or LS to required areas
function setData(x, y) {
    let a = x;
    let b = document.getElementsByClassName("username");
    let c = y;
    let d = document.getElementsByClassName("uid");
    let i;
    for (i = 0; i < b.length; i++) {
        b[i].innerHTML = a;
    }
    for (i = 0; i < d.length; i++) {
        d[i].innerHTML = c;
    }
}

//Clear data
function clearData() {
    localStorage.removeItem("username");
}

//Progress Bar anim
const numb = document.querySelector(".number");
let counter = 0;
setInterval(() => {
  for(var i = 0; i < numb.length; i++) {
    if(counter == 100 ){
        clearInterval();
      }else{
        counter+=1;
        numb[i].textContent = counter + "%";
      }
  }
}, 15);

//Set Data End



//Opened Dashboard State

/*
States:
1 - Overview
2 - Concerns
3 - Admin
4 - Settings
*/
//btns
let btns = {
    bov:document.getElementById("btn-ov"),
    bcc:document.getElementById("btn-cc"),
    badmn:document.getElementById("btn-admin"),
    bas: document.getElementById("btn-as"),
}

btns.bov.addEventListener("click", function () {updateState(1)});
btns.bcc.addEventListener("click", function () {updateState(2)});
btns.badmn.addEventListener("click", function () {updateState(3)});
btns.bas.addEventListener("click", function () {updateState(4)});

let ds;

function updateState(n) {
    let a = document.querySelector(".overview");
    let b = document.querySelector(".concerns");
    let c = document.querySelector(".admin");
    let d = document.querySelector(".settings");
    if (n == 1) {
        //Change views
        a.style.display = "block";
        b.style.display = "none";
        c.style.display = "none";
        d.style.display = "none";
        //Update Buttons
        btns.bov.classList.add("sn-btn-active");
        btns.bcc.classList.remove("sn-btn-active");
        btns.badmn.classList.remove("sn-btn-active");
        btns.bas.classList.remove("sn-btn-active");
        //Call Change Title - Change cttv first
        cttv = "Overview";
        ctt(cttv);
    }
    else if (n == 2) {
        a.style.display = "none";
        b.style.display = "block";
        c.style.display = "none";
        d.style.display = "none";
        btns.bov.classList.remove("sn-btn-active");
        btns.bcc.classList.add("sn-btn-active");
        btns.badmn.classList.remove("sn-btn-active");
        btns.bas.classList.remove("sn-btn-active");
        cttv = "Concerns";
        ctt(cttv);
    }
    else if (n == 3) {
        a.style.display = "none";
        b.style.display = "none";
        c.style.display = "block";
        d.style.display = "none";
        btns.bov.classList.remove("sn-btn-active");
        btns.bcc.classList.remove("sn-btn-active");
        btns.badmn.classList.add("sn-btn-active");
        btns.bas.classList.remove("sn-btn-active");
        cttv = "Admin";
        ctt(cttv);
    }
    else if (n == 4) {
        a.style.display = "none";
        b.style.display = "none";
        c.style.display = "none";
        d.style.display = "block";
        btns.bov.classList.remove("sn-btn-active");
        btns.bcc.classList.remove("sn-btn-active");
        btns.badmn.classList.remove("sn-btn-active");
        btns.bas.classList.add("sn-btn-active");
        cttv = "Settings";
        ctt(cttv);
    }
    else {
        alert("Wrong parameter passed");
    }
}

//Change Title Text
var cttv;
function ctt(n) {
    document.getElementById("tn-tt").innerHTML = n;
}

//Open-close floating user info
var sfui = 0;
var nfui = 0;
document.querySelector(".u-info").onclick = ocui;
document.querySelector(".u-n-btn").onclick = ocn;

function ocui() {
    let a = document.getElementById("uim");
    let b = document.querySelector(".topnav");
    let c = document.querySelector(".u-info");

    if (sfui == 0 && nfui ==0) {
        while (sfui < 1) {
            a.style.display = "grid";
            b.style.backgroundColor = "#ede3bd";
            c.style.color = "#b33030";
            sfui = sfui + 1;
        }
    } else if (sfui == 1) {
        a.style.top = "-300px";
        a.style.opacity = "0";
        b.style.backgroundColor = "#EEEBDD";
        c.style.color = "#810000";
        setTimeout(function() {
            a.style.display = "none";
            a.style.top = "60px";
            a.style.opacity = "1";
        }, 500);
        sfui = sfui - 1;
    } else if (sfui == 0 && nfui == 1) {
        ocn();
        a.style.display = "grid";
        b.style.backgroundColor = "#ede3bd";
        c.style.color = "#b33030";
        sfui = sfui + 1;
    } else {
        console.log("Loop error");
        console.log(sfui);
    }
}

//Notifications floating div
function ocn() {
    let a = document.getElementById("nm");
    let b = document.querySelector(".topnav");
    let c = document.querySelector(".u-n-btn");

    if (sfui == 0 && nfui ==0) {
        while (nfui < 1) {
            a.style.display = "grid";
            b.style.backgroundColor = "#ede3bd";
            c.style.color = "#b33030";
            nfui = nfui + 1;
        }
    } else if (nfui == 1) {
        a.style.top = "-300px";
        a.style.opacity = "0";
        b.style.backgroundColor = "#EEEBDD";
        c.style.color = "#810000";
        setTimeout(function() {
            a.style.display = "none";
            a.style.top = "60px";
            a.style.opacity = "1";
        }, 500);
        nfui = nfui - 1;
    } else if (sfui == 1 && nfui == 0) {
        ocui();
        a.style.display = "grid";
        b.style.backgroundColor = "#ede3bd";
        c.style.color = "#b33030";
        nfui = nfui + 1;
    } else {
        console.log("Loop error");
        console.log(sfui);
    }
}

//Clear Form
function clearForm(form) {
    form.reset();
}

//Clear form
let caaform = document.getElementById("caa");
let caaclearbtn = document.getElementById("caa-clear");

caaclearbtn.addEventListener("click", function () {clearForm(caaform)})