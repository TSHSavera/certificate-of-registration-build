//Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import { getAuth , createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { doc, getDoc, collection, setDoc, getFirestore, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

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



//Realtime Auth Listener
//Set a delay so that the firestore can keep up
onAuthStateChanged(auth, user => {
    if (user != null) {
      console.log("Logged in");
      console.log(user);
      let userData = user;
      let userEmail = userData.email;
      let userUid = userData.uid;
      setData(userEmail, userUid);
      //Push to local storage
      localStorage.setItem("username", userEmail);
      localStorage.setItem("uid", userUid)
      openSn();
      updateState(3);
    } else {
      console.log("Not Logged In");
      window.location.href = "index.html?rdrc=aunauth"
    }
  })


//Authentication
//Variables
var caaEmail = document.getElementById("caa-email");
var caaPass = document.getElementById("caa-pass");
var caaCpass = document.getElementById("caa-cpass");


let caasub = document.getElementById("caa-submit");
let caaChangePass = document.getElementById("ub-cp");



caasub.addEventListener("click", createAdminAccount);

//Create Admin Account
function createAdminAccount() {
  //Get Field Values then push
  let email = caaEmail.value;
  let password = caaPass.value;
  let confirmPassword = caaCpass.value
  let passwordLength = password.length;

  if (password === confirmPassword) {
    if (passwordLength >= 6) {
      if(/@bulsu.edu.ph\s*$/.test(email)) {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          alert("Account Creation Successful!");
          signOut(auth).then(() => {
            alert("Successfully signed out!");
            clearData();
            window.location.href = "index.html?rdrc=authadminreg";
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + " " + errorMessage);
            alert(errorCode + " " + errorMessage);
          })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + " " + errorMessage);
          alert(errorCode + " " + errorMessage);
        });
      } else {
        console.log("Invalid Email!")
        alert("Please use a valid BulSu email!");
      }
    } else {
      alert("Password must be atleast 6 characters");
    }
  } else {
    alert("Passwords doesn't match!");
  }
}




//Logout
document.getElementById("logout").addEventListener("click", function () {
  signOut(auth).then(() => {
    alert("Successfully signed out!");
    clearData();
    window.location.href = "index.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + " " + errorMessage);
    alert(errorCode + " " + errorMessage);
  })
})

//Link COR to Student Number
let lscnSub = document.getElementById("lcsn-link");

lscnSub.addEventListener("click", function() {
  let a = document.getElementById("cor-nos").value;
  let b = document.getElementById("stud-nos").value;
  linkLCSN(a, b);
})
async function linkLCSN(cor, sn) {
  try {
    await setDoc(doc(db, "cor", cor), {
      sn: sn,
    }, {merge: true});
  } catch(e) {
    console.error(e);
  }
} 

//Search
let scfBtn = document.getElementById("sc-cors-btn");
let scornBtn = document.getElementById("scorn-btn");
let scCors = document.getElementById("sc-cors");
let scornCors = document.getElementById("scorn-cors");
let scornId = document.getElementById("scorn-id");
scfBtn.addEventListener("click", function() {
  submitSearch("scf", scCors.value);
});
scornBtn.addEventListener("click", function() {
  submitSearch("scornf", scornCors.value, scornId.value);
})
function submitSearch(type, query, id) {
  if (type == "scf") {
    window.location.href = "search.html?t=" + type + "&q=" + query;
  } else if (type == "scornf") {
    window.location.href = "search.html?t=" + type + "&q" + query + "&id=" + id;
  } else {
    console.error("Invalid Parameters Passed");
  }
}

//Register Student Info
//Event Listeners
let rsiBtn = document.getElementById("rsif-submit");
rsiBtn.addEventListener("click", function() {
  let a = document.getElementById("rsif-name");
  let b = document.getElementById("rsif-email");
  let c = document.getElementById("rsif-cor");
  let d = document.getElementById("rsif-cs");
  let e = document.getElementById("rsif-cn");
  checkStudentRegistrationInfo(a, b, c, d, e)
})
//Perform Checks
function checkStudentRegistrationInfo (name, email, cor, cs, cn) {
  //Check for name length
  if(checkValueLengths(name.value, 5, 4) === false) {
      //Check for name characters
      if(checkStringRule("noSC", name.value) === true) {
          //Check email format
          if(checkStringRule("emailFormat", email.value) === true) {
              //Check cor length
              if(checkValueLengths(cor.value, 9, 2) === true) {
                  //Check course - section length
                  if (checkCourseSection(cs.value) === true) {
                      //Check contact number
                      if(checkValueLengths(cn.value, 11, 2) === true) {
                          //Check contact number validity if user submitted one
                          if(cnValid(cn.value) === true) {
                              //Submit values to firestore
                              registerStudentInfo(name.value, email.value, cor.value, cs.value, cn.value);
                          } else {
                              alert("Invalid contact number!")
                          }
                          //Check if user doesn't submitted a number
                      } else if(checkValueLengths(cn.value, 0, 2) === true) {
                          //Submit values to firestore
                          registerStudentInfo(name.value, email.value, cor.value, cs.value, null);
                      } else {
                          alert("Invalid contact number!");
                      }
                  } else {
                      alert("Invalid Course - Section!")
                  }
              } else {
                  alert("Invalid COR!");
              }
          } else {
              alert("Invalid email!");
          }
      } else {
          alert("Invalid name!")
      }
  } else {
      alert("Invalid name!");
  }
}

async function registerStudentInfo(name, email, cor, cs, cn) {
  try {
      //Set Datas 
      await setDoc(doc(db, "cor", cor), {
      name: name,
      email: email,
      cor: cor,
      courseSection: cs,
      contactNumber: cn,
      }, {merge: true});
      //Do page changes
      alert("Student info registered!");
      clearForm(document.getElementById("rsif"));
  } catch(e) {
      console.error(e);
      //Custom Alert
  }
}














//Validators
//Check Match
function matchCheck(arrayToBeChecked, findingValue) {
  // Convert arrayToBeChecked to an array if it's not already an array
  if (!Array.isArray(arrayToBeChecked)) {
      arrayToBeChecked = [arrayToBeChecked];
  }
  return arrayToBeChecked.includes(findingValue);
}
function matchCheckEi(arrayToBeChecked, findingValue) {
  if (!Array.isArray(arrayToBeChecked)) {
      arrayToBeChecked = [arrayToBeChecked];
  }
  var i;
  for (i = 0; i < arrayToBeChecked.length; i++) {
      if (arrayToBeChecked[i].value == findingValue) {
          return false;
      }
      else {
          return true;
      }
  }
}


//Regex rule checker
function checkStringRule(rule, stringToBeChecked) {
  
  //Regex Rules
  var letters = /^[a-zA-Z\s]*$/;
  var noScFormat = /^[\w\s ,./-]+$/g;
  var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var test1 = /^((0)(9)([0-9]{9}))/g;
  var bulsuemail = /@bulsu.edu.ph\s*$/

  //String Rules
  //Check if given value only consists letters
  if (rule == "letter") {
      if (letters.test(stringToBeChecked) === true) {
          return true;
      }
      else {
          return false;
      }
  }
  //Check if the give value doens't have special character
  else if (rule == "noSC") {
      if (noScFormat.test(stringToBeChecked) === true) {
          return true;
      }
      else {
          return false;
      }
  }
  //Check if the given email format is correct
  else if (rule == "emailFormat") {
      if (mailFormat.test(stringToBeChecked) === true) {
          if (bulsuemail.test(stringToBeChecked) === true) {
              return true;
          }
          else {
              return false;
          }
      }
      else {
          return false;
      }
  }
  //Check if the given contact number is valid
  else if (rule == "phoneNos") {
      if (test1.test(stringToBeChecked) === true) {
          return true;
      }
      else {
          return false;
      }
  }
  else {
      console.error("Unknown string rule! There are only 4 rules: letter, noSC, emailFormat, and phoneNos.");
  }
}

//Contact Number Validator
//Expected Format [09XXXXXXXXX]
function cnValid(nos) {
  if (nos.length== 11) {
      if(checkStringRule("phoneNos", nos) === true) {
          return true;
      }
      else {
          return false;
      }
  }
  else {
      return false;
  }
}
//Check Course - Section
function checkCourseSection(a) {
  let x = /^[A-Z\d]+\s+-+\s+[A-Z\d]+$/;
  if (x.test(a) === true) {
      return true;
  } else {
      return false;
  }
}
//Check Empty inputs
function checkEmptyInputs(arrayOfInputValues) {
  if (matchCheck(arrayOfInputValues, "") === false) {
      return true;
  }
  else {
      return false;
  }
}

//Check value length
function checkValueLengths(value, rlength, rule) {
  //Rule 0: >
  if (rule == 0) {
      if (value.length > rlength) {
          return true;
      } else {
          return false
      }
  }
  //Rule 1: < 
  else if (rule == 1) {
      if (value.length < rlength) {
          return true;
      } else {
          return false;
      }
  }
  //Rule 2: ==
  else if (rule == 2) {
      if (value.length == rlength) {
          return true;
      } else {
          return false;
      }
  }
  //Rule 3: >=
  else if (rule == 3) {
      if (value.length >= rlength) {
          return true;
      } else {
          return false
      }
  }
  //Rule 4: <=
  else if (rule == 4) {
      if (value.length <= rlength) {
          return true;
      } else {
          return false;
      }
  }
  //Rule 5: !=
  else if (rule == 5) {
      if (value.length != rlength) {
          return true;
      } else {
          return false;
      }
  }
  //Unmatched rule
  else {
      console.log("Invalid rule parameter passed");
  }
}
