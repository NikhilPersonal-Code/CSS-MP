const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");
const errorBox = document.getElementById("errorBox");
const successBox = document.getElementById("successBox");
if (isAdminAuthenticated != "true") {
  showErrorBox("Admin Not Authenticated");
  setTimeout(function () {
    window.location.assign("http://127.0.0.1:3001/form/form.html");
  }, 1500);
}
function showErrorBox(message) {
  errorBox.classList.remove("opacity-0");
  errorBox.getElementsByClassName("errortext")[0].textContent = message;
  setTimeout(function(){
    errorBox.classList.add("opacity-0");
  }, 2000);
}
function showSuccessBox(message) {
  successBox.classList.remove("opacity-0");
  successBox.getElementsByClassName("successText")[0].textContent = message;
  setTimeout(function(){
    successBox.classList.add("opacity-0");
  }, 2000);
}
function closeSuccessDialog() {
  successBox.classList.add('opacity-0');
}
function closeErrorDialog() {
  errorBox.classList.add('opacity-0');
}
async function handleSubmit(event) {
  event.preventDefault();
  let prsubs = ["ajp", "css", "osy", "ste", "cpp", "itr"];
  let thsubs = ["ajp", "css", "osy", "ste", "est"];
  for (let i = 0; i < prsubs.length; i++) {
    const marks = parseInt(event.target[prsubs[i] + "pr"].value);
    if (i === 5) {
      if (marks > 150 || marks < 0) {
        showErrorBox(prsubs[i] + " Marks Range = 0 to 150");
        return;
      }
    } else if (marks > 50 || marks < 0) {
      showErrorBox(prsubs[i] + " Marks Range = 0 to 50");
      return;
    }
  }
  for (let i = 0; i < thsubs.length; i++) {
    const marks = parseInt(event.target[thsubs[i] + 'th'].value);
    if (marks > 100 || marks < 0) {
      showErrorBox(thsubs[i] + " Marks Range = 0 to 100");
      return;
    }
  }
  let studObj = {
    name: event.target.name.value,
    enrollment_no: parseInt(event.target.enrollmentNo.value),
    seat_no: parseInt(event.target.seatno.value),
    csspr: parseInt(event.target.csspr.value),
    stepr: parseInt(event.target.stepr.value),
    ajppr: parseInt(event.target.ajppr.value),
    itrpr: parseInt(event.target.itrpr.value),
    cpppr: parseInt(event.target.cpppr.value),
    osypr: parseInt(event.target.osypr.value),
    cssth: parseInt(event.target.cssth.value),
    steth: parseInt(event.target.steth.value),
    ajpth: parseInt(event.target.ajpth.value),
    estth: parseInt(event.target.estth.value),
    osyth: parseInt(event.target.osyth.value),
  };
  if(studObj.enrollment_no.toString().length!=9){
    showErrorBox("Enrollment No. Length Should Be 9");
    return;
  }  
  if(studObj.seat_no.toString().length!=6){
    showErrorBox("Seat No. Length Should Be 6");
    return;
  }
  if (/^[^a-zA-Z\s]+$/.test(studObj.name)) {
    showErrorBox("Name should contain alphabets only...");
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/api/addResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studObj),
    });

    const result = await response.json();

    if (result.success) {
      showSuccessBox("Student Result Added Successfully");
    } else {
      showErrorBox("Student Result Exists Already or Some Error Occurred");
    }
  } catch (error) {
    console.error("Error submitting result:", error);
    showErrorBox("Network or Server Error");
  }
}
