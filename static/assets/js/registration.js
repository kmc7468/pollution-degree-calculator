function onpageload() {
    // 이미 로그인 되어있을때
}

function register() {
    var id = document.getElementById('idBox').value;
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;

    if (password !== passwordConfirm) {
        // 비밀번호가 일치하지 않을때 처리
        return;
    }

    // 회원가입 코드
}

document.getElementById('registerBTN').addEventListener('click', register);
window.addEventListener('load', onpageload);
