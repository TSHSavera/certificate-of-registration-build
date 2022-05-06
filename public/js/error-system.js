//Errors

//Get error div style data on the element

function setEdPosData () {
    const ed = document.querySelectorAll(".error-div");
    for (var i = 0; i < ed.length; i++) {
        const edPosDataB = ed[i].getAttribute("data-edposb");
        const edPosDataR = ed[i].getAttribute("data-edposr");
        const edPosDataT = ed[i].getAttribute("data-edpost");
        const edPosDataL = ed[i].getAttribute("data-edposl");
        const edSizeDataW = ed[i].getAttribute("data-edsizew");
        const edSizeDataH = ed[i].getAttribute("data-edsizeh");
        try {
            let a = parseFloat(edPosDataB);
            let b = parseFloat(edPosDataR);
            let c = parseFloat(edPosDataT);
            let d = parseFloat(edPosDataL);
            let e = parseFloat(edSizeDataW);
            let f = parseFloat(edSizeDataH);
            ed[i].style.bottom = a + "%";
            ed[i].style.right = b + "%";
            ed[i].style.top = c + "%";
            ed[i].style.left = d + "%";
            ed[i].style.width = e + "px";
            ed[i].style.height = f + "px";
        } catch (e) {
            console.error(e);
        }
    }
}


//Call Error
//Active Errors Counter
let aec = 0;
//Currently Shown Errors Counter
let cse = -1;
//Error storage, clears on page reload
    const Acet = [];
    const Acec = [];
    const Aced = [];
function createCustomError(customErrorTitle, customErrorCode, customErrorDetails) {
    const error_div = document.createElement('div');
    error_div.classList.add('error-div', 'dt-acc-error', 'slide-in-left-2');
    error_div.innerHTML = "<button class='dt-acc-error close-error-div'><i class='fas fa-window-close'></i></button><span><i class='fas fa-minus-circle'></i></span> <p class='error-title'></p><span class='error-code'></span><p class='error-details'></p>";
    error_div.setAttribute("data-edposb", 2);
    error_div.setAttribute("data-edposl", 2);
    error_div.setAttribute("data-edsizew", 350);
    error_div.setAttribute("data-edsizeh", 175);
    document.body.appendChild(error_div);
    error_div.children[2].innerHTML = customErrorTitle;
    error_div.children[3].innerHTML = customErrorCode;
    error_div.children[4].innerHTML = customErrorDetails;
    setEdPosData();
    var closeBtn = document.getElementsByClassName('close-error-div');
    for (var i = 0; i < closeBtn.length; i++) {
        closeBtn[i].addEventListener('click', (e) => {
            e.currentTarget.parentNode.remove();
        }, false);
    }
    
}

//Start Error Style
setEdPosData();



//Create custom notice
function createCustomNotice(msg) {
    const notice_div = document.createElement('div');
    notice_div.classList.add('notice-div', 'dt-cont-prima', 'slide-in-up');
    notice_div.innerHTML = "<button class='dt-acc-error close-notice-div'><i class='fas fa-window-close'></i></button>  <span><i class='fas fa-exclamation-triangle'></i></span> <span class='nd-txt'></span>";
    document.body.appendChild(notice_div);
    notice_div.children[2].innerHTML = msg;
    setEdPosData();
    var ncloseBtn = document.getElementsByClassName('close-notice-div');
    for (var i = 0; i < ncloseBtn.length; i++) {
        ncloseBtn[i].addEventListener('click', (e) => {
            e.currentTarget.parentNode.remove();
        }, false);
    }
    
}
