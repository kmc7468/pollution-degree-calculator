function onpageload() {
    // 여기에 이미 로그인 되었을때 코드 작성
}

function login() {
    var userid = document.getElementById('idBox').value;
    var password = document.getElementById('password').value;

    // 로그인 코드
}


document.getElementById('loginBTN').addEventListener('click', login);
window.addEventListener('load', onpageload);
