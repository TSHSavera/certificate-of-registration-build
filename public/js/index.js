//script.js
//Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-3I4IZd4r74b-MaS6ARtCOqlDUiAhZu0",
  authDomain: "certificateofregistration-app.firebaseapp.com",
  projectId: "certificateofregistration-app",
  storageBucket: "certificateofregistration-app.appspot.com",
  messagingSenderId: "606134508492",
  appId: "1:606134508492:web:0b50d5555cf565483fdb69",
  measurementId: "G-5Y99W03NX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

/*
//Variables
let btn_s = document.querySelector("#btn-s");
let btn_f = document.querySelector("#btn-f");
let btn_b_sf = document.querySelector("#b-sf-btn");
let btn_b_fl = document.querySelector("#b-fl-btn");

//Event Listener
btn_s.addEventListener("click", function() {st("a")});
btn_f.addEventListener("click", function() {st("b")});
btn_b_sf.addEventListener("click", function() {st("c")});
btn_b_fl.addEventListener("click", function() {st("c")});

//Function
function st(n) {
    //Variables
    let a = document.querySelector(".ia-1");
    let b = document.querySelector(".ia-2");
    let c = document.querySelector(".ia-3");
    let d = document.querySelector("#h-msg");
    //Code
    if (n == "a") {
        a.style.display = "none";
        b.style.display = "grid";
        c.style.display = "none";
        d.innerHTML = "Student Form";

    }
    else if (n == "b") {
        a.style.display = "none";
        b.style.display = "none";
        c.style.display = "grid";
        d.innerHTML = "Faculty Login";
    }
    else if (n == "c") {
        a.style.display = "inline-grid";
        b.style.display = "none";
        c.style.display = "none";
        d.innerHTML = "To start, please state if you're a <b>Student</b> or a <b>Faculty</b>";
    }
}

Deprecated
*/

//Realtime Auth Listener
onAuthStateChanged(auth, user => {
    if (user != null) {
      console.log("Logged in");
      pushAdminData();
    } else {
      console.log("Not Logged In");
    }
  })

//Login Faculty Account
var loginEmail = document.getElementById("fie");
var loginPass = document.getElementById("fip");
let l_btn = document.querySelector(".login-faculty-btn");
//Event Listener
l_btn.addEventListener("click", function() {
    if(loginEmail.value != "" && loginEmail.value != undefined && loginEmail.value != null) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginEmail.value)) {
        if(loginPass.value.length >= 6) {
          l_btn.classList.toggle('active');
          setTimeout(loginAdminAccount, 4800);
        } else {
          createCustomNotice("Password is too short, please try again.");
        }
      } else {
        createCustomNotice("Invalid email, please provide a valid one.")
      }
    } else {
      createCustomNotice("Email form is empty!");
    }
})


function loginAdminAccount() {
    let email = loginEmail.value;
    let password = loginPass.value;
    let passwordLength = loginPass.value.length;
  
    if (passwordLength >= 6) {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const regEmail = user.email;
        const regUid = user.uid;
        console.log(user);
        pushAdminData();
        //Push to local storage
        localStorage.setItem("username", regEmail);
        localStorage.setItem("uid", regUid)
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " - " + errorMessage);
        let errorTitle = error.code.substring(5);
        createCustomError(errorTitle, errorCode, errorMessage)
      })
    } else {
      alert("Password must be atleast 6 characters");
    }
  }

function pushAdminData() {
  checkAdminData();
  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1000);
}


//Database access
//Perms
async function checkAdminData() {
  const uid = localStorage.getItem("uid");
  const docRef = doc(db, "userAdminCreds", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let a = docSnap.data();
    let b = a.isAdmin;
    console.log(a);
    localStorage.setItem("fs-data", b);
  } else {
    console.log("No data");
  }
}
//Additional Features
//Get Redirect Code to give messages to user
//Error Lists
const aunauth001 = {
  error_title: "Unauthorized",
  error_code: "ECOR001",
  error_description: "You must be authorized to continue"
}
const aunauthadmin002 = {
  error_title: "Forbidden",
  error_code: "ECOR002",
  error_description: "You're accessing a prohibited page"
}

function checkForParams() {
  var a = getAllUrlParams().rdrc;
  if (a === undefined) {
    console.log("No redirect code");
  } else if (a == "aunauth") {
    createCustomError(aunauth001.error_title, aunauth001.error_code, aunauth001.error_description);
  } else if (a == "aunauthadmin") {
    createCustomError(aunauthadmin002.error_title, aunauthadmin002.error_code, aunauthadmin002.error_description);
  } else if (a == "csub") {
    b.innerHTML = "Thank you for using our service";
  } else if (a == "authadminreg") {
    b.innerHTML == "Admin account creation successful. Please re-login to continue";
  } else {
    alert("Invalid parameter passed!");
    console.log(a);
  }
}
checkForParams();


//Student Form
let proceedBtn = document.querySelector(".login-stud-btn");
function proceedToConcerns() {
    let a = document.getElementById("sie");
    let b = document.getElementById("sip");
    let c = document.querySelector(".login-stud-btn");
    if(a.value != "" && a.value != undefined && a.value != null) {
      if (/@bulsu.edu.ph\s*$/.test(a.value)) {
        if (b.value.length == 10) {
            c.classList.toggle('active');
            setTimeout(() => {
              localStorage.setItem("subEmail", a.value);
              localStorage.setItem("subCor", b.value);
              let c = localStorage.getItem("subEmail");
              let d = localStorage.getItem("subCor");
              //Go to concerns dashboard
              window.location.href = "concern.html?es=" + c + "&rn=" + d;
            }, 5250);
        } else {
            createCustomNotice("Invalid registration number, please provide a valid one.")
        }
    } else {
        createCustomNotice("Invalid email, please provide a BulSU domain email.")
    }
  } else {
    createCustomNotice("Email must not be empty");
  }   
}

proceedBtn.addEventListener("click", proceedToConcerns);

createCustomNotice("Login on enter disabled due to security issues");