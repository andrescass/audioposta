//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

// Retrieve fields
var pass1Field = document.getElementById('id_pass1');
var pass2Field = document.getElementById('id_pass2');
var passButton = document.getElementById('passButton');
var msgdiv = document.getElementById('message_div');

passButton.addEventListener('click', passEvent);
//var baseServerUrl = "http://postarecorder.pythonanywhere.com"
var baseServerUrl = "http://127.0.0.1:8000"

if(!localStorage.hasOwnProperty('posta_token'))
{
    window.location.replace(baseServerUrl);
}

pass2Field.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      loginButton.click();
    }
  });

function passEvent(){
    var pass1 = pass1Field.value;
    var pass2 = pass2Field.value;

    if(pass1.length > 0 && pass2.length > 0)
    {
        if(pass1 == pass2){
            msgdiv.innerHTML='';
            fetch(baseServerUrl+"/rest-auth/password/change/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.posta_token
                },
                body: JSON.stringify({
                    "new_password1": pass1,
                    "new_password2": pass2
                })
            }).then( response => {
                if(response.ok)
                {
                    // Borro el nuevo token y solicito que se logueen de nuevo
                    localStorage.removeItem("posta_token");                    
                    response.json().then(j => {
                        alert('Contraseña cambiada. Deberá iniciar sesión nuevamente.');
                        window.location.replace(baseServerUrl+'/podcaster/podcasts/');
                        window.location.replace(baseServerUrl+'/podcaster/login');
                    })
                }
                else{
                    postMsg('La contraseña debe tener como mínimo 8 caracteres');
                }
                return(response);
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
        else
        {
            postMsg('Las contraseñas deben ser iguales');
        }
    }
    else
    {
        postMsg('Debe ingresar dos veces la misma contraseña');
    }

    
}

function postMsg(msgText){
    var msg = document.createElement('p');
    msg.innerHTML = msgText;
    msgdiv.appendChild(msg);
}