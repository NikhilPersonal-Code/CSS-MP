const noRegex = /^[\d]*$/;
const formBox =document.getElementById("formBox");
const shadowBox =document.getElementById("shadowBox");
const studentIdentfierElement = document.getElementById("studId");
const errorBox = document.getElementById("errorBox");
function addShadowFormBox() {
    shadowBox.classList.add("neon-shadow");
}
function removeShadowFormBox() {
    shadowBox.classList.remove("neon-shadow");
}
async function showResult() {
    let no = studentIdentfierElement.value;
    if(no==''||!noRegex.test(no)){
        showErrorBox("Invalid Enrollment/Seat No");
    }
    else{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(`http://localhost:3000/api/getResult?studentIdentifier=${no}`, {
          method: "GET",
          headers: myHeaders,
        });
        const data = await response.json();
        if(data.success&&data.success==false){
            showErrorBox("Invalid Enrollment/Seat No");
            return;
        }
        if(localStorage.getItem("studentIdentifier")){
            localStorage.clear();
        }
        localStorage.setItem("studentIdentifier",no);
        window.location.assign("http://127.0.0.1:3001/result/result.html");
    }
};
function closeDialog(){
    errorBox.classList.add("opacity-0");
}
studentIdentfierElement.addEventListener("keypress",function(e){
    if(e.key=='Enter'){
        showResult();
    }
})
function showErrorBox(message) {
    errorBox.classList.remove("opacity-0");
    errorBox.getElementsByClassName("errortext")[0].textContent = message;
    setTimeout(function(){
        errorBox.classList.add("opacity-0");
    },2000)     
}
function addResult(){
    let adminPass = prompt("Enter Admin Password");
    if(adminPass==null||adminPass!='iamgreatest'){
        showErrorBox("Invalid Admin Password");
        return;
    };
    localStorage.setItem("isAdminAuthenticated","true");
    window.location.assign("http://127.0.0.1:3001/admin/admin.html");
}