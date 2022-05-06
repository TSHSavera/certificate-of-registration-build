//script.js

//Login Button Animation  
  const container = document.querySelector('.login-stud-btn')
  container.addEventListener('animationend', () => {
  container.classList.remove('active');
  container.style.pointerEvents = 'initial';
  stud_in_form_btn.style.pointerEvents = 'initial';
  faculty_in_form_btn.style.pointerEvents = 'initial';
});
container.addEventListener("animationstart", () => {
  container.style.pointerEvents = "none";
  stud_in_form_btn.style.pointerEvents = 'none';
  faculty_in_form_btn.style.pointerEvents = 'none';
})
 
const container2 = document.querySelector('.login-faculty-btn')
container2.addEventListener('animationend', () => {
  container2.classList.remove('active');
  container2.style.pointerEvents = 'initial';
  stud_in_form_btn.style.pointerEvents = 'initial';
  faculty_in_form_btn.style.pointerEvents = 'initial';
});
container2.addEventListener("animationstart", () => {
  container2.style.pointerEvents = "none";
  stud_in_form_btn.style.pointerEvents = 'none';
  faculty_in_form_btn.style.pointerEvents = 'none';
})

//Switch forms
const stud_in_form = document.querySelector('.stud-in-form');
const faculty_in_form = document.querySelector('.faculty-in-form');
const stud_in_form_btn = document.querySelector('.stud-in-form-btn');
const faculty_in_form_btn = document.querySelector('.faculty-in-form-btn');
const type_login_txt = document.querySelector('.type-of-login');

stud_in_form_btn.addEventListener("click", function() {changeForm(1)});
faculty_in_form_btn.addEventListener("click", function() {changeForm(2)});

changeForm(1);
function changeForm(a) {
  if(a == 1) {
    //Open Student Form
    stud_in_form.style.display = "block";
    faculty_in_form.style.display = "none";
    stud_in_form_btn.classList.add('dt-cont-second');
    stud_in_form_btn.classList.remove('dt-cont-prima');
    faculty_in_form_btn.classList.add('dt-cont-prima');
    faculty_in_form_btn.classList.remove('dt-cont-second');
    type_login_txt.innerHTML = "Student";
  } else if (a == 2) {
    //Open Faculty Form
    stud_in_form.style.display = "none";
    faculty_in_form.style.display = "block";
    stud_in_form_btn.classList.remove('dt-cont-second');
    stud_in_form_btn.classList.add('dt-cont-prima');
    faculty_in_form_btn.classList.remove('dt-cont-prima');
    faculty_in_form_btn.classList.add('dt-cont-second');
    type_login_txt.innerHTML = "Faculty";
  } else {
    console.error("Unkwown passed parameter");
  }
}