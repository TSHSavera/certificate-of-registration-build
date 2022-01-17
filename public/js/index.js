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


//Realtime Auth Listener
onAuthStateChanged(auth, user => {
    if (user != null) {
      console.log("Logged in");
      pushAdminData();
    } else {
      console.log("Not Logged In");
    }
  })

//Login Admin Account
var loginEmail = document.getElementById("login-username");
var loginPass = document.getElementById("login-password");
let l_btn = document.getElementById("l-fl-btn");
//Event Listener
l_btn.addEventListener("click", function() {
    loginAdminAccount();
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
        alert("Successful Login!");
        pushAdminData();
        //Push to local storage
        localStorage.setItem("username", regEmail);
        localStorage.setItem("uid", regUid)
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " - " + errorMessage);
        openAlert()
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
function checkForParams() {
  var a = getAllUrlParams().rdrc;
  var b = document.getElementById("f-text");
  if (a === undefined) {
    console.log("No redirect code");
    b.innerHTML = "";
  } else if (a == "aunauth") {
    b.innerHTML = "You must be authorized to continue";
  } else if (a == "aunauthadmin") {
    b.innerHTML = "You're accessing a prohibited page. Your account might get locked if you continue to access it.";
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
let proceedBtn = document.getElementById("p-sf-btn");
function proceedToConcerns() {
    let a = document.getElementById("email");
    let b = document.getElementById("cor");

    if (/@bulsu.edu.ph\s*$/.test(a.value)) {
        if (b.value.length == 9 ) {
            localStorage.setItem("subEmail", a.value);
            localStorage.setItem("subCor", b.value);
            let c = localStorage.getItem("subEmail");
            let d = localStorage.getItem("subCor");
            //Go to concerns dashboard
            window.location.href = "concern.html?es=" + c + "&rn=" + d;
        } else {
            alert("Invalid registration number, please provide a valid one.")
        }
    } else {
        alert("Invalid email, please provide a BulSu domain email.")
    }   
}

proceedBtn.addEventListener("click", proceedToConcerns);

//Read page index
function readPageIndex() {
  let a = getAllUrlParams().pi;
  if (a === undefined) {
    console.log("No page index. Default loaded");
  } else if (a == "a") {
    st("a");
  } else if (a == "b") {
    st("b");
  } else if (a == "c") {
    st("c");
  } else {
    alert("Invalid parameter passed!");
  }
}

readPageIndex();