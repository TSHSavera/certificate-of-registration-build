//Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import { getAuth , createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import { doc, getDoc, collection, setDoc, getFirestore, getDocs, collectionGroup, query, orderBy, where, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";

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
      updateState(1);
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
    clearData();
    window.location.href = "index.html";
  }).catch((e) => {
    console.error(e);
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log(errorCode + " - " + errorMessage);
    let errorTitle = e.code.substring(5);
    createCustomError(errorTitle, errorCode, errorMessage);
  });
});



//Search
let scfBtn = document.getElementById("sc-cors-btn");
let scornBtn = document.getElementById("scorn-btn");
let scCors = document.getElementById("sc-cors");
let scornCors = document.getElementById("scorn-cors");
let scornId = document.getElementById("scorn-id");
let scornrn = document.getElementById("scorn-rn");
scornBtn.addEventListener("click", () => {
  scornBtn.setAttribute("data-user-reg-nos", scornrn.value);
  scornBtn.setAttribute("data-concern-id", scornId.value);
  setTimeout(function() {
    openConcernPreviewPanel(scornBtn);
  }, 1000);
});
//scornBtn.addEventListener("click", function() {
//  submitSearch("scornf", scornCors.value, scornId.value);
//});

//Register Student Info
//Event Listeners
let rsiBtn = document.getElementById("rsi-submit");
rsiBtn.addEventListener("click", function() {
  let rsifname = document.getElementById("rsi-fname");
  let rsimname = document.getElementById("rsi-mname");
  let rsilname = document.getElementById("rsi-lname");
  let rsiemail = document.getElementById("rsi-email");
  let rsicor = document.getElementById("rsi-cor");
  let rsic = document.getElementById("rsi-cs");
  let rsis = document.getElementById("rsi-section");
  let rsicn = document.getElementById("rsi-cn");
  checkStudentRegistrationInfo(rsifname, rsimname, rsilname, rsiemail, rsicor, rsic, rsis, rsicn);
});
document.getElementById("rsi-cf").addEventListener("click", function() {
  document.getElementById("rsi").reset();
})
//Perform Checks
function checkStudentRegistrationInfo (fname, mname, lname, email, cor, c, s, cn) {
  //Check for name length
  if(checkValueLengths(fname.value, 1, 4) === false && checkValueLengths(mname.value, 1, 4) === false && checkValueLengths(lname.value, 1, 4) === false) {
      //Check for name characters
      if(checkStringRule("noSC", fname.value) === true && checkStringRule("noSC", mname.value) === true && checkStringRule("noSC", lname.value) === true) {
          //Check email format
          if(checkStringRule("emailFormat", email.value) === true) {
              //Check cor length
              if(checkValueLengths(cor.value, 10, 2) === true) {
                  //Check course - section length
                  if (checkCourseSection(c.value, s.value) === true) {
                      //Check contact number
                      if(checkValueLengths(cn.value, 11, 2) === true) {
                          //Check contact number validity if user submitted one
                          if(cnValid(cn.value) === true) {
                              //Submit values to firestore
                              registerStudentInfo(fname.value, mname.value, lname.value, email.value, cor.value, c.value, s.value, cn.value);
                          } else {
                              alert("Invalid contact number!");
                          }
                          //Check if user doesn't submitted a number
                      } else if(checkValueLengths(cn.value, 0, 2) === true) {
                          //Submit values to firestore
                          registerStudentInfo(fname.value, mname.value, lname.value, email.value, cor.value, c.value, s.value, null);
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
          console.log("IN");
      }
  } else {
      alert("Invalid name!");
      console.log("OUT");
  }
}

async function registerStudentInfo(fname, mname, lname, email, cor, c, s, cn) {
  try {
      //Set Datas 
      await setDoc(doc(db, "cor", cor), {
      fname: fname,
      mname: mname,
      lname: lname,
      email: email,
      cor: cor,
      course: c,
      section: s,
      contactNumber: cn,
      }, {merge: true});
      //Do page changes
      alert("Student info registered!");
      clearForm(document.getElementById("rsif"));
  } catch(e) {
    console.error(e);
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log(errorCode + " - " + errorMessage);
    let errorTitle = e.code.substring(5);
    createCustomError(errorTitle, errorCode, errorMessage);  
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
function checkCourseSection(a, b) {
  let x = /([1-9])+([A-Z])/g;
    if (a != "0") {
        if (x.test(b) === true) {
            return true;
        } else {
            return false;
        }
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
document.querySelector(".update-cl").addEventListener("click", () => {
  getAllConcernData("desc");
});
async function getAllConcernData(state) {
  //Disable update btn
  document.querySelector(".update-cl").disabled = true;
  document.querySelector(".filters-cl").disabled = true;
  //Process
  const data = query(collectionGroup(db, "concerns"), orderBy("timestamp", state));
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
  a.classList.add("d3-g-item", "dt-btn-cont-surface", "in-opacity");
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
    //Enable button again
    document.querySelector(".update-cl").disabled = false;
    document.querySelector(".filters-cl").disabled = false;
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
  //Push Attributes to LS
  localStorage.setItem("dataUserRegNos", dataB);
  localStorage.setItem("dataConcernId", dataA);
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
    if(objData.contactNumber == null) {
      cppcn.innerHTML  = "null";
    } else {
      cppcn.innerHTML  = objData.contactNumber;
    }
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
  } else {
    createCustomNotice("No concern data found!");
  }
  
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

//Open filter concern panel
document.querySelector(".filters-cl").addEventListener("click", openFilterConcernPanel);
function openFilterConcernPanel() {
  let a = document.querySelector(".filter-list-panel-opac");
  a.style.display = "block";
}

//Close filter concern panel
document.querySelector(".flp-close").addEventListener("click", closeFilterConcernPanel);
function closeFilterConcernPanel() {
  let a = document.querySelector(".filter-list-panel-opac");
  a.style.display = "none";
}
document.querySelector(".fl-cai").addEventListener("click", clearAllFilterInputs);
//Clear all filter inputs
function clearAllFilterInputs() {
  let a = document.querySelector(".flp-grid").getElementsByTagName("input");
  for (var i = 0; i < a.length; i++) {
    a[i].value = "";
  }
  //Clear select
  let b = document.querySelector("#fl-cs");
  b.selectedIndex = 0;
}

//Add event listener to all filter btns
let fbtn = document.querySelectorAll(".filter-btn");
for (var i = 0; i < fbtn.length; i++) {
  fbtn[i].addEventListener("click", event => useFilters(event.currentTarget));
}
//Use filters
async function useFilters(el) {
  let dfi = el.getAttribute("data-filter-id");
  if (dfi == "regnos") {
    const flrn = document.querySelector("#fl-regnos").value;
    if (checkValueLengths(flrn, 10, 2) == true) {
      const regnosRef = doc(db, "cor", flrn);
      const regnosSnap = await getDoc(regnosRef);
      //Process Data
      if (regnosSnap.exists()) {
        const rnrDataQuery = query(collection(db, "cor", flrn, "concerns"));
        const rnrdqSnapshot = await getDocs(rnrDataQuery);
        rnrdqSnapshot.forEach((documentrn) => {
          showAllData(documentrn.data(), documentrn.id);
        });
      closeFilterConcernPanel();
      createCustomNotice("Student Number (" + flrn +") filter applied. ");
      } else {
        createCustomNotice("No data found for Student Number: " + flrn);
      }
    } else {
      createCustomNotice("Invalid Student Number!");
    }
  } else if (dfi == "asc") {
    getAllConcernData();
    closeFilterConcernPanel();
    createCustomNotice("Oldest concern first filter applied");
  } else if (dfi == "email") {
    const flemail = document.querySelector("#fl-email").value;
    if (checkStringRule("emailFormat", flemail) === true) {
      const emailQuery = query(collection(db, "cor"), where("email", "==", flemail));
      const emqSnapshot = await getDocs(emailQuery);
      if (emqSnapshot.size == 0) {
        createCustomNotice("No data found for email: " + flemail);
      } else {
          emqSnapshot.forEach(async (documentE) => {
          const emqsDataQuery = query(collection(db, "cor", documentE.id, "concerns"));
          const emqsdqSnapshot = await getDocs(emqsDataQuery);
          emqsdqSnapshot.forEach((documentERN) => {
            showAllData(documentERN.data(), documentERN.id);
          });
          closeFilterConcernPanel();
          createCustomNotice("Email (" + flemail +") filter applied. ");
        });
      }
      
    } else {
      createCustomNotice("Invalid Email! Please provide a BulSU domain email");
    }
  } else if(dfi == "cn") {
    const flcn = document.querySelector("#fl-cn").value;
    if(checkValueLengths(flcn, 11, 2) === true) {
      if (cnValid(flcn) === true) {
        const cnQuery = query(collection(db, "cor"), where("contactNumber", "==", flcn));
        const cnqSnapshot = await getDocs(cnQuery);
        if (cnqSnapshot.size == 0) {
          createCustomNotice("No data found for mobile number: " + flcn);
        } else {
              cnqSnapshot.forEach(async (documentCn) => {
              const cnqsDataQuery = query(collection(db, "cor", documentCn.id, "concerns"));
              const cnqsdqSnapshot = await getDocs(cnqsDataQuery);
                cnqsdqSnapshot.forEach((documentCNRN) => {
                showAllData(documentCNRN.data(), documentCNRN.id);
            });
            closeFilterConcernPanel();
            createCustomNotice("Mobile Number (" + flcn +") filter applied. ");
          });
        }
      } else {
        createCustomNotice("Invalid mobile number!");
      }
    } else {
      createCustomNotice("Invalid mobile number!");
    }
  } else if (dfi == "course") {
    const flcs = document.querySelector("#fl-cs").value;
    if (flcs != "0") {
      const csQuery = query(collection(db, "cor"), where("course", "==", flcs));
      const csqSnapshot = await getDocs(csQuery);
      if (csqSnapshot.size == 0) {
        createCustomNotice("No data found for course: " + flcs);
      } else {
            csqSnapshot.forEach(async (documentCs) => {
            const csqsDataQuery = query(collection(db, "cor", documentCs.id, "concerns"));
            const csqsdqSnapshot = await getDocs(csqsDataQuery);
              csqsdqSnapshot.forEach((documentCSRN) => {
              showAllData(documentCSRN.data(), documentCSRN.id);
          });
          closeFilterConcernPanel();
          createCustomNotice("Course (" + flcs +") filter applied. ");
        });
      }
    } else {
      createCustomNotice("Invalid course data!");
    }
  } else if (dfi == "ln") {
    const flln = document.querySelector("#fl-ln").value;
    if (checkStringRule("noSC", flln) == true && checkValueLengths(flln, 0, 5) == true) {
      const lnQuery = query(collection(db, "cor"), where("lname", "==", flln));
      const lnqSnapshot = await getDocs(lnQuery);
      if (lnqSnapshot.size == 0) {
        createCustomNotice("No data found for last name: " + flln);
      } else {
            lnqSnapshot.forEach(async (documentLn) => {
            console.log(documentLn);
            const lnqsDataQuery = query(collection(db, "cor", documentLn.id, "concerns"));
            const lnqsdqSnapshot = await getDocs(lnqsDataQuery);
              lnqsdqSnapshot.forEach((documentLNRN) => {
              showAllData(documentLNRN.data(), documentLNRN.id);
          });
          closeFilterConcernPanel();
          createCustomNotice("Last name (" + flln +") filter applied. ");
        });
      }
    } else {
      createCustomNotice("Invalid Last Name!");
    }
  } else if (dfi == "ouv") {
    const ouvQuery = query(collectionGroup(db, "concerns"), where("isViewed", "==", false));
    const ouvqSnapshot = await getDocs(ouvQuery);
    if (ouvqSnapshot.size == 0) { 
      createCustomNotice("All concerns has been viewed");
    } else {
      ouvqSnapshot.forEach(async (documentOuv) => {
        console.log(documentOuv.data());
        let lc = documentOuv.data().linkedCor;
        let lccid = documentOuv.id;
        const ouvqsDataQuery = doc(db, "cor", lc, "concerns", lccid);
        const ouvqsdqSnapshot = await getDoc(ouvqsDataQuery);
        console.log(ouvqsdqSnapshot);
        //Process Data
        if(ouvqsdqSnapshot.exists()) {
          showAllData(ouvqsdqSnapshot.data(), ouvqsdqSnapshot.id);
        } else {
          createCustomNotice("No data available");
        }
      });
      closeFilterConcernPanel();
      createCustomNotice("Only viewing unviewed concerns");
    }
  }
}

document.querySelector(".cpp-dc").addEventListener("click", function() {
  deleteConcern(localStorage.getItem("cppCID"));
})
//Delete Concern
async function deleteConcern(concernID) {
  const dcCID = concernID;
  if (confirm("Are you sure you want to delete concern with ID: " + dcCID + "?")) {
    //Close preview
    closeConcernReviewPanel();
    //Delete element
    let a = document.querySelector("div[data-concern-id='" + dcCID + "']");
    a.remove();
    //Delete data on the database
    try {
      await deleteDoc(doc(db, "cor", localStorage.getItem("cppRegNos"), "concerns", localStorage.getItem("cppCID")));
      createCustomNotice("Deleted successfully!");
    } catch (e) {
      console.error(e);
      const errorCode = e.code;
      const errorMessage = e.message;
      console.log(errorCode + " - " + errorMessage);
      let errorTitle = e.code.substring(5);
      createCustomError(errorTitle, errorCode, errorMessage);
    }
  } else {
    return false;
  }
}


//File Storage
//Root ref
document.querySelector(".cpp-vcf").addEventListener("click", function() {
  getCorPDF(localStorage.getItem("dataUserRegNos"));
})

const storage = getStorage();

//Get Data
function getCorPDF(regnos) {
  getDownloadURL(ref(storage, "certificates-of-registration/" + regnos + ".pdf"))
  .then((url) => {
    window.open(url);
  })
  .catch((error) => {
    let errortitle = error.code.substring(8);
    switch (error.code) {
      case 'storage/object-not-found':
        createCustomError(errortitle, error.code, "File doesn't exist");
        break;
      case 'storage/unauthorized':
        createCustomError(errortitle, error.code, "User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        createCustomError(errortitle, error.code, "User cancelled the upload");
        break;
      case 'storage/unauthenticated':
        createCustomError(errortitle, error.code, "User is unauthenticated, please authenticate and try again.");
        break;
      case 'storage/retry-limit-exceeded':
        createCustomError(errortitle, error.code, "exceeded	The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.");
        break;
      case 'storage/invalid-checksum':
        createCustomError(errortitle, error.code, "File on the client does not match the checksum of the file received by the server. Try uploading again.");
        break;
      case 'storage/cannot-slice-blob':
        createCustomError(errortitle, error.code, "Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.");
        break;
      case 'storage/invalid-url':
        createCustomError(errortitle, error.code, "Invalid URL was passed to the server. Reload the page and try again.");
        break;
      case 'storage/server-file-wrong-size':
        createCustomError(errortitle, error.code, "File on the client does not match the size of the file recieved by the server. Try uploading again.");
        break;
      case 'storage/unknown':
        createCustomError(errortitle, error.code, "Unknown error occurred, inspect the server response");
        break;
    }
  });
}
document.querySelector("#file-upload-pdf").addEventListener("change", inspectData);
//Send Data
function inspectData() {
  let a = document.querySelector("#file-upload-pdf");
  let b = document.querySelector(".fu-fn");
  b.innerHTML = a.value.substring(12);
}

document.querySelector(".fu-btn").addEventListener("click", uploadFile);
function uploadFile() {
  let filePath = document.querySelector("#file-upload-pdf").value.substring(12);
  let fpf = document.querySelector("#file-upload-pdf").files;

  const storageRef = ref(storage, "certificates-of-registration/" + filePath);
  const uploadTask = uploadBytesResumable(storageRef, fpf);
  uploadTask.on('state_changed',
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    let b =document.querySelector(".fupp");
    b.innerHTML = progress
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        createCustomError(errortitle, error.code, "File doesn't exist");
        break;
      case 'storage/unauthorized':
        createCustomError(errortitle, error.code, "User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        createCustomError(errortitle, error.code, "User cancelled the upload");
        break;
      case 'storage/unauthenticated':
        createCustomError(errortitle, error.code, "User is unauthenticated, please authenticate and try again.");
        break;
      case 'storage/retry-limit-exceeded':
        createCustomError(errortitle, error.code, "exceeded	The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.");
        break;
      case 'storage/invalid-checksum':
        createCustomError(errortitle, error.code, "File on the client does not match the checksum of the file received by the server. Try uploading again.");
        break;
      case 'storage/cannot-slice-blob':
        createCustomError(errortitle, error.code, "Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.");
        break;
      case 'storage/invalid-url':
        createCustomError(errortitle, error.code, "Invalid URL was passed to the server. Reload the page and try again.");
        break;
      case 'storage/server-file-wrong-size':
        createCustomError(errortitle, error.code, "File on the client does not match the size of the file recieved by the server. Try uploading again.");
        break;
      case 'storage/unknown':
        createCustomError(errortitle, error.code, "Unknown error occurred, inspect the server response");
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref)
    .then((url) => {
    window.open(url);
  })
  });
}


//SEARCH DATA
document.querySelector(".dl-close").addEventListener("click", closeDataLookup);
function closeDataLookup() {
  document.querySelector(".data-lookup-opac").style.display = "none";
}
function openDataLookup() {
  document.querySelector(".data-lookup-opac").style.display = "block";
}
document.querySelector("#sc-cors-btn").addEventListener("click", searchForStudentData);

async function searchForStudentData() {
  const regnos = document.getElementById("sc-cors").value;
  const docRef = doc(db, "cor", regnos);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()) {
    let data = docSnap.data();
    openDataLookup();
    document.querySelector(".dl-fname").innerHTML = data.fname;
    document.querySelector(".dl-mname").innerHTML = data.mname;
    document.querySelector(".dl-lname").innerHTML = data.lname;
    document.querySelector(".dl-email").innerHTML = data.email;
    document.querySelector(".dl-course").innerHTML = data.course;
    document.querySelector(".dl-section").innerHTML = data.section;
    document.querySelector(".dl-regnos").innerHTML = data.cor;
    document.querySelector(".dl-cn").innerHTML = data.contactNumber;
  } else {
    createCustomNotice("No data found!");
  }
}