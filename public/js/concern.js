//Concern.js
//Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { doc, collection, setDoc, getFirestore, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

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
let cfName = document.getElementById("cf-name");
let cfEmail = document.getElementById("cf-email");
let cfCor = document.getElementById("cf-cor");
let cfCs = document.getElementById("cf-cs");
let cfCn = document.getElementById("cf-cn");
let cfConcern = document.getElementById("cf-concern")
let cfSub = document.getElementById("cf-submit");
let cfDc = document.getElementById("cf-dc");
let ci = document.getElementById("concern-index");

//Event Listeners
cfSub.addEventListener("click", function () {
    //Array of values
    let a = [cfName.value, cfEmail.value, cfCor.value, cfCs.value, cfConcern.value];
    //Check for empty inputs before proceeding to form check
    if(checkEmptyInputs(a) === true) {
        checkStudentForm(cfName, cfEmail, cfCor, cfCs, cfCn, cfConcern)
    } else {
        alert("Please fill up all required fields")
    }
});
cfDc.addEventListener("click", function () {
    window.location.href = "index.html";
});
ci.addEventListener("click", function () {
    window.location.href = "index.html?rdrc=csub";
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


function checkStudentForm (name, email, cor, cs, cn, concern) {
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
                                //Check concern if it exceeds for atleast 20 Characters
                                if(checkValueLengths(concern.value, 20, 0) === true) {
                                    //Submit values to firestore
                                    submitToDatabase(name.value, email.value, cor.value, cs.value, cn.value, concern.value);
                                } else {
                                    alert("20 Characters required!")
                                }
                            } else {
                                alert("Invalid contact number!")
                            }
                            //Check if user doesn't submitted a number
                        } else if(checkValueLengths(cn.value, 0, 2) === true) {
                            //Check concern if it exceeds for atleast 20 Characters
                            if(checkValueLengths(concern.value, 20, 0) === true) {
                                //Submit values to firestore
                                submitToDatabase(name.value, email.value, cor.value, cs.value, null, concern.value);
                            } else {
                                alert("20 Characters required!")
                            }
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



async function submitToDatabase(name, email, cor, cs, cn, concern) {
    try {
        //Set Datas 
        await setDoc(doc(db, "cor", cor), {
        name: name,
        email: email,
        cor: cor,
        courseSection: cs,
        contactNumber: cn,
        }, {merge: true});
        const docRef = await addDoc(collection(db, "cor", cor, "concerns"), {
        concernData: concern,
        isViewed: false,
        timestamp: serverTimestamp(),
        });
        console.log(docRef.id);
        //Do page changes
        let a = document.querySelector(".concern-main-container");
        let b = document.querySelector(".concern-preview-container");
        a.style.display = "none";
        b.style.display = "block";
    } catch(e) {
        console.error(e);
        //Custom Alert
    }
}
