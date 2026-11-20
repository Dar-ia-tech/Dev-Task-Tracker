const loginForm = document.getElementById('login-form');
const loginUser = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('btn-login');
const errorMsg = document.getElementById('login-error');
const MY_LOGIN = 'Daria'; 
 const MY_PASSWORD = '1234';

const authorizationKey =  localStorage.getItem('flora_auth');
if(authorizationKey){
    window.location.href = 'index.html';
}

loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const getInput = loginUser.value.trim();
    const getPassword = loginPassword.value.trim();

    if(getInput === MY_LOGIN && getPassword === MY_PASSWORD){
    localStorage.setItem('flora_auth', 'true');
    window.location.href = 'index.html';
}else{
    errorMsg.classList.remove('hidden');
}
});

loginUser.addEventListener('input', function(e){
    e.preventDefault();
    errorMsg.classList.add('hidden');
})

