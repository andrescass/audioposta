//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

// Retrieve fields
//var pods = document.getElementById('token');
var logout_link = document.getElementById("logout_nav");
var pass_link = document.getElementById("changepass_nav");

var baseServerUrl = "http://postarecorder.pythonanywhere.com"

if(localStorage.hasOwnProperty('posta_token'))
{

    fetch(baseServerUrl+"/podcaster/getpodcaster/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.posta_token
        }
    }).then( response => {
        if(response.ok)
        {
            response.json().then(j => {
                var salute = document.getElementById("name_salute");
                salute.innerHTML="Hola " + j.username;
                showLists();           
            })
        }
        else{
            console.log('Usuario o contraseña incorrecto');
        }
        return(response);
    }).catch((error) => {
        console.error('Error:', error);
    });
}
else
{
    window.location.replace(baseServerUrl+'/podcaster/login');
}

// Show podcast list
function showLists(hackerList)
{

    fetch(baseServerUrl+"/api/entry-get/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.posta_token
        }
    }).then( response => {
        if(response.ok)
        {
            response.json().then(j => { 
                console.log(j);           
                var options = {
                    valueNames: [
                        'audioName', 
                        'podcast', 
                        'author',
                        'email',
                        'dateStr',
                        'hourStr',
                        //{attr: 'id', name:'audiomsg'} ]
                        'audiomsg',
                        'remove']
                  };
                  
                  let firstAUd = '<audio controls="controls" src="' + j[0].audio_url + '" type="audio/mpeg">'; 

                  var values = [
                    {   audioName:j[0].audio_url, 
                        podcast: j[0].podcast.name, 
                        author:j[0].author_name,
                        email:j[0].author_email,
                        dateStr:j[0].date,
                        hourStr: j[0].hour,
                        audiomsg : firstAUd,
                        remove: '<button class="remove-item-btn" onclick="butc(' + j[0].id + ')">Borrar</button>' }, 
                  ];
                  
                  hackerList = new List('hacker-list', options, values);
                  for(let i = 1; i < j.length; i++)
                  {
                      audio_i = '<audio controls="controls" src="' + j[i].audio_url + '" type="audio/mpeg">'; 
                      hackerList.add(
                        { audioName:j[i].audio_url, 
                            podcast: j[i].podcast.name, 
                            author:j[i].author_name,
                            email:j[i].author_email,
                            dateStr:j[i].date,
                            hourStr: j[i].hour,
                            audiomsg :audio_i,
                            remove: '<button class="remove-item-btn" onclick="butc(' + j[i].id +  ')">Borrar</button>' }
                      );
                  }     

                  let buttons = document.getElementsByClassName("remove-item-btn");
                  /*window.onload= j => {    
                    for(let i = 1; i < j.length; i++)
                    {
                        let audio_td = document.getElementById("audio_"+j[i].id);
                        let au = document.createElement('audio');
                        au.controls = true;
                        au.src = j[i].audio_url;
                        //audio_td.appendChild(au);
                        audio_td.innerHTML = "lalalal";
                    }
                }*/
                //return hackerList;
            })
        }
        else{
            console.log('Usuario o contraseña incorrecto');
        }
        return(hackerList);
    }).catch((error) => {
        console.error('Error:', error);
    });
}

// Log out action: get back to log in page and delete token
logout_link.addEventListener("click", () => {
    localStorage.removeItem('posta_token');
    window.location.replace(baseServerUrl+'/podcaster/login');
    }
)

// Change password action
pass_link.addEventListener("click", () => {
    window.location.replace(baseServerUrl+'/podcaster/changepassword');
    }
)

function butc(p_id){
    let alert_msg = "Estás por borrar definitivamente el mensaje";
    let answer = window.confirm(alert_msg);
    if(answer)
    {
        fetch(baseServerUrl+"/api/entry-delete/"+p_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.posta_token
            }
        }).then( response => {
            if(response.ok)
            {
                location.reload();
            }
            else{
                alert("Ocurrió un error al borrar el mensaje");
            }   
        });
    }
}
