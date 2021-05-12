//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

// Retrieve fields
var usernameField = document.getElementById('id_username');
var passwordField = document.getElementById('id_password');
var loginButton = document.getElementById('loginButton');
var msgdiv = document.getElementById('message_div');

loginButton.addEventListener('click', loginEvent);
//var baseServerUrl = "http://postarecorder.pythonanywhere.com"
var baseServerUrl = "http://127.0.0.1:8000"

if(localStorage.hasOwnProperty('posta_token'))
{
    window.location.replace(baseServerUrl+'/podcaster/podcasts/');
}

passwordField.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      loginButton.click();
    }
  });

function loginEvent(){
    var userName = usernameField.value;
    var password = passwordField.value;

    if(userName.length > 0 && password.length > 0)
    {
        msgdiv.innerHTML='';
        fetch(baseServerUrl+"/api/auth-token/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username" : userName,
    			"password" : password
            })
        }).then( response => {
            if(response.ok)
            {
                response.json().then(j => {
                    localStorage.setItem("posta_token", j.token);                    
                    window.location.replace(baseServerUrl+'/podcaster/podcasts/');
                })
            }
            else{
                postMsg('Usuario o contraseña incorrecto');
            }
            return(response);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    else
    {
        postMsg('Debe ingresar nombre de usuario o email y contraseña');
    }

    
}

function postMsg(msgText){
    var msg = document.createElement('p');
    msg.innerHTML = msgText;
    msgdiv.appendChild(msg);
}