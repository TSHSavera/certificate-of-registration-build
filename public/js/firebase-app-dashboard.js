//Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import { getAuth , createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { doc, getDoc, collection, setDoc, getFirestore, getDocs, addDoc, collectionGroup, query } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

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
      setTimeout(stopPreloader, 500);
      console.log("Logged in");
      console.log(user);
      let userData = user;
      let userEmail = userData.email;
      let userUid = userData.uid;
      setData(userEmail, userUid);
      //Push to local storage
      localStorage.setItem("username", userEmail);
      localStorage.setItem("uid", userUid);
      openSn();
      updateState(3);
    } else {
      console.log("Not Logged In");
      window.location.href = "index.html?rdrc=aunauth";
    }
  });
function stopPreloader() {
  document.querySelector(".pre-loader").style.opacity = "0";
  setTimeout(function() {
    document.querySelector(".pre-loader").style.display = "none";
  }, 500);
}

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
  let confirmPassword = caaCpass.value;
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
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + " " + errorMessage);
          alert(errorCode + " " + errorMessage);
        });
      } else {
        console.log("Invalid Email!");
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
  });
});

//Link COR to Student Number
let lscnSub = document.getElementById("lcsn-link");

lscnSub.addEventListener("click", function() {
  let a = document.getElementById("cor-nos").value;
  let b = document.getElementById("stud-nos").value;
  linkLCSN(a, b);
});
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
});
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
  checkStudentRegistrationInfo(a, b, c, d, e);
});
//Perform Checks
function checkStudentRegistrationInfo (fname, mname, lname, email, cor, cs, cn) {
  //Check for name length
  if(checkValueLengths(fname.value, 1, 4) === false && checkValueLengths(mname.value, 1, 4) && checkValueLengths(lname.value, 1, 4) === false) {
      //Check for name characters
      if(checkStringRule("noSC", fname.value) === true && checkStringRule("noSC", mname.value) === true && checkStringRule("noSC", lname.value) === true) {
          //Check email format
          if(checkStringRule("emailFormat", email.value) === true) {
              //Check cor length
              if(checkValueLengths(cor.value, 10, 2) === true) {
                  //Check course - section length
                  if (checkCourseSection(cs.value) === true) {
                      //Check contact number
                      if(checkValueLengths(cn.value, 11, 2) === true) {
                          //Check contact number validity if user submitted one
                          if(cnValid(cn.value) === true) {
                              //Submit values to firestore
                              registerStudentInfo(fname.value, mname.value, lname.value, email.value, cor.value, cs.value, cn.value);
                          } else {
                              alert("Invalid contact number!");
                          }
                          //Check if user doesn't submitted a number
                      } else if(checkValueLengths(cn.value, 0, 2) === true) {
                          //Submit values to firestore
                          registerStudentInfo(fname.value, mname.value, lname.value, email.value, cor.value, cs.value, null);
                      } else {
                          alert("Invalid contact number!");
                      }
                  } else {
                      alert("Invalid Course - Section!");
                  }
              } else {
                  alert("Invalid COR!");
              }
          } else {
              alert("Invalid email!");
          }
      } else {
          alert("Invalid name!");
      }
  } else {
      alert("Invalid name!");
  }
}

async function registerStudentInfo(fname, mname, lname, email, cor, cs, cn) {
  try {
      //Set Datas 
      await setDoc(doc(db, "cor", cor), {
      fname: fname,
      mname: mname,
      lname: lname,
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
  var bulsuemail = /@bulsu.edu.ph\s*$/;

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
          return false;
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
          return false;
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


//Get all concern data
document.querySelector(".update-cl").addEventListener("click", getAllConcernData);
async function getAllConcernData() {
  const data = query(collectionGroup(db, "concerns"));
  const querySnapshot =  await getDocs(data);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    showAllData(doc.data(), doc.id);
  });
}

async function showAllData(documentData, concernID) {
  //Start showing the loading screen and clearing the previous list
  startSADLoad();
  setTimeout(async () => {
    let d3gl = document.querySelector(".d3-g-list");
  //Create the element then add the required data to it
  let a = document.createElement("div");
  let b = "<span class='con-name'></span><span class='con-email'></span><span class='con-course'></span><span class='con-section'></span><span class='con-id'></span><span class='con-no'></span>";
  a.classList.add("d3-g-item", "dt-btn-cont-surface");
  a.setAttribute("role", "button");
  a.setAttribute("tabindex", "0");
  a.setAttribute("aria-pressed", "false");
  a.setAttribute("data-concern-id", concernID);
  a.setAttribute("data-user-reg-nos", documentData.linkedCor);
  a.addEventListener("click", event => openConcernPreviewPanel(event.currentTarget));
  a.innerHTML = b;
  //Append to parent
  d3gl.appendChild(a);
  //Get data from database based on linkedCor
  const docRef = doc(db, "cor", documentData.linkedCor);
  const docSnap =  await getDoc(docRef);
  //Process obtained database
  if (docSnap.exists()) {
    const data = docSnap.data();
    //Set values
    a.children[0].innerHTML = data.fname + " " + data.lname;
    a.children[1].innerHTML = data.email;
    a.children[2].innerHTML = data.course;
    a.children[3].innerHTML = data.section;
    a.children[4].innerHTML = concernID;
    a.children[5].innerHTML = data.cor;
  } else {
    createCustomError("No User Data found", "COR_NO_DATA_AVAILABLE", "No data is present on the database. Maybe it was corrupted or deleted.");
  }
  }, 3000);
}


async function openConcernPreviewPanel(element) {
  console.log(element);
  //Get required elements for preview
  let cppname = document.querySelector(".cpp-g-c-d-name");
  let cppemail = document.querySelector(".cpp-g-c-d-email");
  let cppregnos = document.querySelector(".cpp-g-c-d-regnos");
  let cppcid = document.querySelector(".cpp-g-c-d-cid");
  let cppc = document.querySelector(".cpp-g-c-d-c");
  let cpps = document.querySelector(".cpp-g-c-d-s");
  let cppcn = document.querySelector(".cpp-g-c-d-cn");
  let cppcl = document.querySelector(".cpp-g-c-d-cl");
  let cppts = document.querySelector(".cpp-g-ts");
  //Get attributes
  let dataA = element.getAttribute("data-concern-id");
  let dataB = element.getAttribute("data-user-reg-nos");
  //Obtain student data on the database
  const docRef = doc(db, "cor", dataB);
  const docSnap = await getDoc(docRef);
  //Start processing student data
  if(docSnap.exists()) {
    const objData = docSnap.data();
    //For Dev Purposes
    console.log(objData);
    //Set values
    cppname.innerHTML = objData.fname + " " + objData.mname + " " + objData.lname;
    cppemail.innerHTML = objData.email;
    cppregnos.innerHTML = objData.cor;
    cppc.innerHTML  = objData.course;
    cpps.innerHTML = objData.section;
    cppcn.innerHTML  = objData.contactNumber;
  } else {
    createCustomNotice("No student data found!");
  }
  //Obtain concern data
  const docRef2 = doc(db, "cor", dataB, "concerns", dataA);
  const docSnap2 = await getDoc(docRef2);
  //Start processing concern data
  if(docSnap2.exists()) {
    const objData2 = docSnap2.data();
    //For Dev Purposes
    console.log(objData2);
    //Set values
    cppcid.innerHTML = dataA;
    cppcl.innerHTML = objData2.concernData;
    cppts.innerHTML = objData2.timestamp.toDate();
  } else {
    createCustomNotice("No concern data found!");
  }
  //Change the concern state to viewed once opened
  try {
    await setDoc(doc(db, "cor", dataB, "concerns", dataA), {
      isViewed: true,
    }, {merge: true});
  } catch(e) {
    console.error(e);
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log(errorCode + " - " + errorMessage);
    let errorTitle = e.code.substring(5);
    createCustomError(errorTitle, errorCode, errorMessage);
  }
  //Evaulate isViewed data
  evaluateIsViewedData(dataB, dataA);
  //Push currently opened concern data to storage
  localStorage.setItem("cppRegNos", dataB);
  localStorage.setItem("cppCID", dataA);
  //Show preview panel
  let cppo = document.querySelector(".concern-preview-panel-opac");
  cppo.style.display = "block";
}

function startSADLoad() {
  let a = document.querySelector(".d3-g-load");
  let b = document.querySelectorAll(".d3-g-item");
  a.style.display = "block";
  b.forEach((e) => {
    e.style.display = "none";
    e.remove();
  });
  //Return views
  setTimeout(() => {
    a.style.display = "none";
    let c = document.querySelectorAll(".d3-g-item");
    for (var i = 0; i < c.length; i++) {
      c[i].style.display = "grid";
    }
  }, 3000);
}
document.querySelector(".cpp-close").addEventListener("click", closeConcernReviewPanel);
function closeConcernReviewPanel() {
  let a = document.querySelector(".concern-preview-panel-opac");
  a.style.display = "none";
}

//Mark as unviewed
document.querySelector(".cpp-mau").addEventListener("click", function() {
  unviewConcern(localStorage.getItem("cppRegNos"), localStorage.getItem("cppCID"));
})
async function unviewConcern(regnos, cid) {
  try {
    await setDoc(doc(db, "cor", regnos, "concerns", cid), {
      isViewed: false,
    }, {merge: true});
  } catch(e) {
    console.error(e);
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log(errorCode + " - " + errorMessage);
    let errorTitle = e.code.substring(5);
    createCustomError(errorTitle, errorCode, errorMessage);
  }
  evaluateIsViewedData(regnos, cid);
}
async function evaluateIsViewedData(regnos, cid) {
  //Elements
  let cppgs = document.querySelector(".cpp-g-cs");
  //Process data
  const docRef = doc(db, "cor", regnos, "concerns", cid);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()) {
    const data = docSnap.data();
    console.log(data);
    if (data.isViewed === true) {
      cppgs.innerHTML = "Viewed";
    } else if (data.isViewed === false) {
      cppgs.innerHTML = "Unviewed";
    } else {
      cppgs.innerHTML = "Error";
      createCustomNotice("Unknown Error Occurred!");
    }
  }
}