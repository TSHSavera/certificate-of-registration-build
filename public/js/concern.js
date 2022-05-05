//Concern.js
//Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { doc, collection, setDoc, getFirestore, addDoc, serverTimestamp, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

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
const db = getFirestore(app);


//Variables
let cffName = document.getElementById("cf-fname");
let cfmName = document.getElementById("cf-mname");
let cflName = document.getElementById("cf-lname");
let cfEmail = document.getElementById("cf-email");
let cfCor = document.getElementById("cf-cor");
let cfCs = document.getElementById("cf-cs");
let cfS = document.getElementById("cf-section");
let cfCn = document.getElementById("cf-cn");
let cfConcern = document.getElementById("cf-concern");
let cfSub = document.getElementById("cf-submit");
let cfDc = document.getElementById("cf-dc");
let ci = document.getElementById("concern-index");

//Event Listeners
cfSub.addEventListener("click", function () {
    //Array of values
    let a = [cffName.value, cfmName.value, cflName.value, cfEmail.value, cfCor.value, cfCs.value, cfConcern.value];
    //Check for empty inputs before proceeding to form check
    if(checkEmptyInputs(a) === true) {
        checkStudentForm(cffName, cfmName, cflName, cfEmail, cfCor, cfCs, cfS, cfCn, cfConcern);
    } else {
        createCustomNotice("Please fill up all required fields");
    }
});
cfDc.addEventListener("click", function () {
    let a = document.getElementById("scf");
    a.reset();
});

//Set Data from previous pane
function setData() {
    let a = getAllUrlParams().es;
    let b = getAllUrlParams().rn;
    cfEmail.value = a;
    cfCor.value = b;
}
setData();  

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
            if (nos != "09123456789") {
                return true;
            } else {
                return false;
            }
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

//Check for dummy Values
function checkRegNoDummyValues(value) {
    switch(value) {
        case "1234567890":
            return false;
            break;
        case "01234567890":
            return false;
            break;
        case "1231231231":
            return false;
            break;
        case "1234123412":
            return false;
            break;
        case "0000000000":
            return false;
            break;
        case "1111111111":
            return false;
            break;
        case "2222222222":
            return false;
            break;
        case "3333333333":
            return false;
            break;
        case "4444444444":
            return false;
            break;
        case "5555555555":
            return false;
            break;
        case "6666666666":
            return false;
            break;
        case "7777777777":
            return false;
            break;
        case "8888888888":
            return false;
            break;
        case "9999999999":
            return false;
            break;
        case "1234512345":
            return false;
            break;
        default:
            return true;
    }
}


function checkStudentForm (fname, mname, lname, email, cor, cs, sec, cn, concern) {
    //Check for name length
    if(checkValueLengths(fname.value, 1, 4) === false && checkValueLengths(mname.value, 1, 4) === false && checkValueLengths(lname.value, 1, 4) === false) {
        //Check for name characters
        if(checkStringRule("noSC", fname.value) === true && checkStringRule("noSC", mname.value) === true && checkStringRule("noSC", lname.value) === true) {
            //Check email format
            if(checkStringRule("emailFormat", email.value) === true) {
                //Check cor length
                if(checkValueLengths(cor.value, 10, 2) === true && checkRegNoDummyValues(cor.value) === true) {
                    //Check course - section length
                    if (checkCourseSection(cs.value, sec.value) === true) {
                        //Check contact number
                        if(checkValueLengths(cn.value, 11, 2) === true) {
                            //Check contact number validity if user submitted one
                            if(cnValid(cn.value) === true) {
                                //Check concern if it exceeds for atleast 20 Characters
                                if(checkValueLengths(concern.value, 20, 0) === true) {
                                    //Submit values to firestore
                                    submitToDatabase(fname.value, mname.value, lname.value, email.value, cor.value, cs.value, sec.value, cn.value, concern.value);
                                } else {
                                    createCustomNotice("There should be atleast 20 characters in your concern.");
                                }
                            } else {
                                createCustomNotice("Invalid contact number!");
                            }
                            //Check if user doesn't submitted a number
                        } else if(checkValueLengths(cn.value, 0, 2) === true) {
                            //Check concern if it exceeds for atleast 20 Characters
                            if(checkValueLengths(concern.value, 20, 0) === true) {
                                //Submit values to firestore
                                submitToDatabase(fname.value, mname.value, lname.value ,email.value, cor.value, cs.value, null, concern.value);
                            } else {
                                createCustomNotice("20 Characters required!");
                            }
                        } else {
                            createCustomNotice("Invalid contact number!");
                        }
                    } else {
                        createCustomNotice("Invalid Course - Section!");
                    }
                } else {
                    createCustomNotice("Invalid COR!");
                }
            } else {
                createCustomNotice("Invalid email!");
            }
        } else {
            createCustomNotice("Invalid name!");
        }
    } else {
        createCustomNotice("Invalid name!");
    }
}



async function submitToDatabase(fname, mname, lname, email, cor, cs, sec, cn, concern) {
    try {
        //Set Datas 
        await setDoc(doc(db, "cor", cor), {
        fname: fname,
        mname: mname,
        lname: lname,
        email: email,
        cor: cor,
        course: cs,
        section: sec,
        contactNumber: cn,
        }, {merge: true});
        const docRef = await addDoc(collection(db, "cor", cor, "concerns"), {
        linkedCor: cor,
        concernData: concern,
        isViewed: false,
        timestamp: serverTimestamp(),
        });
        //console.log(docRef.id);
        //Do page changes
        viewConfirmation();
        //Push regnos to local
        localStorage.setItem("subCor", cor);
        setRegNosOnPage();
    } catch(e) {
        console.error(e);
        const errorCode = e.code;
        const errorMessage = e.message;
        console.log(errorCode + " - " + errorMessage);
        let errorTitle = e.code.substring(5);
        createCustomError(errorTitle, errorCode, errorMessage);
    }
}

function setRegNosOnPage() {
    let a = localStorage.getItem("subCor");
    document.querySelector(".regno-prev").innerHTML = a;
}



//Get all concerns from regnos
document.querySelector(".sn-b4").addEventListener("click", () => {
    getAllConcerns(localStorage.getItem("subCor"));
});
async function getAllConcerns(regnos) {
    getAllUserData(regnos);
    cleanSneakPeek();
    const queue= query(collection(db, "cor", regnos, "concerns"));
    const queueSnapshot = await getDocs(queue);
    queueSnapshot.forEach((doc) => {
        presentData(doc);
        //console.log(doc.id, " => ", doc.data());
    });
}
//Get all user info on the particular regnos collection
async function getAllUserData(regnos) {
    const docRef = doc(db, "cor", regnos);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        const data = docSnap.data();
        //console.log(data);
        localStorage.setItem("userDataFname", data.fname);
        localStorage.setItem("userDataCourse", data.course);
        localStorage.setItem("userDataSection", data.section);
    } else {
        createCustomNotice("No data found");
    }
}

async function openFormPreview(element) {
    //Get required elements for preview
    let ctp = document.querySelector(".concern-text-preview");
    let ctpo = document.querySelector(".concern-text-preview-opac");
    let ctpn = document.querySelector(".ctp-name");
    let ctpe = document.querySelector(".ctp-email");
    let ctpc = document.querySelector(".ctp-c");
    let ctps = document.querySelector(".ctp-s");
    let ctpnos = document.querySelector(".ctp-nos");
    let ctpconcern = document.querySelector(".ctp-concern");
    let ctpcid = document.querySelector(".ctp-cid");
    //Data
    let regnos = localStorage.getItem("subCor");
    //Get required data
    const docRef = doc(db, "cor", regnos);
    const docSnap = await getDoc(docRef);
    //Process Data
    if(docSnap.exists()) {
        const data = docSnap.data();
        //console.log(data);
        //Set values to the element previews
        ctpn.innerHTML = data.fname + " " + data.mname + " " + data.lname;
        ctpe.innerHTML =  data.email;
        ctpc.innerHTML = data.course;
        ctps.innerHTML = data.section;
        ctpnos.innerHTML = data.contactNumber;  
        ctp.style.display = "block";
        ctpo.style.display = "block";
    } else {
        createCustomNotice("No user data found");
    }
    //Data for concerns
    //console.log(element)
    const dcid = element.getAttribute("data-concern-id");
    const docRef2 = doc(db, "cor", regnos, "concerns", dcid);
    const docSnap2 = await getDoc(docRef2);
    //Process again for
    if(docSnap2.exists()) {
        const data = docSnap2.data();
        //console.log(data);
        //Set value to html
        ctpconcern.innerHTML = data.concernData;
        ctpcid.innerHTML = dcid;
    } else {
        createCustomNotice("No user data found");
    }
}

function presentData(doc) {
    let udfn = localStorage.getItem("userDataFname");
    let udc = localStorage.getItem("userDataCourse");
    let uds = localStorage.getItem("userDataSection");
    let clg = document.querySelector(".concerns-list-grid");
    //Create the element then add the required data to it
    let a = document.createElement("div");
        a.classList.add("concern-item", "dt-cont-surface");
        a.setAttribute("data-concern-id", doc.id);
        a.addEventListener('click', event => openFormPreview(event.currentTarget));
        a.innerHTML = "<span class='cl-fname'></span> <span class='cl-cs'><span class='cl-c'></span> - <span class='cl-s'></span></span><span class='cl-cid'></span>";
        //Append to parent
        clg.appendChild(a);
        //Set Values
        //Name
        a.children[0].innerHTML = udfn;
        //Course
        a.children[1].children[0].innerHTML = udc;
        //Sections
        a.children[1].children[1].innerHTML = uds;
        //concernID
        a.children[2].innerHTML = doc.id;
}
function cleanSneakPeek() {
    let clfs = document.querySelector(".cl-fetch-screen");
    let clg = document.querySelector(".concerns-list-grid");
    let cli = document.querySelectorAll(".concern-item");
    //Clear the screen first and show the fetching screen
    clg.style.display = "none";
    clfs.style.display = "block";
    //Then clear all of the elements of previous update
    cli.forEach((item) => {
        item.remove();
    });
    //Then give a moment to finish present data
    setTimeout(() => {
        //Hide the fetching screen then present data
        clg.style.display = "grid";
        clfs.style.display = "none";
    }, 3000);
}



document.querySelector(".ctp-close").addEventListener("click", closeFormPreview);
function closeFormPreview() {
    //Get required elements for preview
    let ctp = document.querySelector(".concern-text-preview");
    let ctpo = document.querySelector(".concern-text-preview-opac");
    
    //Close the preview
    ctp.style.display = "none";
    ctpo.style.display = "none";
}

//Set the submitted regnos at the start then preview it
document.querySelector(".regno-prev").innerHTML = localStorage.getItem("subCor");

let snb1 = document.querySelector(".sn-b1");
let snb2 = document.querySelector(".sn-b2");
let snb3 = document.querySelector(".sn-b3");
snb1.addEventListener("click", viewConcerns);
snb2.addEventListener("click", submitaNewConcern);
snb3.addEventListener("click", () => {
    window.location.href = "index.html";
});

function submitaNewConcern() {
    let a = document.querySelector(".cmc-grid-1");
    let b = document.querySelector(".concern-preview-container");
    let c = document.querySelector(".sn-b2");
    let d = document.querySelector(".sn-b1");
    let e = document.querySelector(".sn-b4");
    let f = document.querySelector(".concern-list");
    a.style.display = "block";
    b.style.display = "none";
    c.style.display = "none";
    d.style.display = "block";
    e.style.display = "none";
    f.style.display = "none";
    let g = document.getElementById("scf");
    g.reset();
}
//Change views
function viewConcerns() {
    let cmcg = document.querySelector(".cmc-grid-1");
    let cl = document.querySelector(".concern-list");
    let cpc = document.querySelector(".concern-preview-container");
    let snb1 = document.querySelector(".sn-b1");
    let snb2 = document.querySelector(".sn-b2");
    let snb4 = document.querySelector(".sn-b4");
    cmcg.style.display = "none";
    cl.style.display = "block";
    cpc.style.display = "none";
    snb1.style.display = "none";
    snb2.style.display = "block";
    snb4.style.display = "block";
}

function viewConfirmation() {
    let cmcg = document.querySelector(".cmc-grid-1");
    let cl = document.querySelector(".concern-list");
    let cpc = document.querySelector(".concern-preview-container");
    let snb1 = document.querySelector(".sn-b1");
    let snb2 = document.querySelector(".sn-b2");
    let snb4 = document.querySelector(".sn-b4");
    cmcg.style.display = "none";
    cl.style.display = "none";
    cpc.style.display = "block";
    snb1.style.display = "block";
    snb2.style.display = "block";
    snb4.style.display = "none";
}