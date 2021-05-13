//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

// Retrieve fields
//var pods = document.getElementById('token');
var logout_link = document.getElementById("logout_nav");
var pass_link = document.getElementById("changepass_nav");

// Table order list
var podcast_order = document.getElementById('podcast_a');
var author_order = document.getElementById('author_a');
var email_order = document.getElementById('email_a');
var date_order = document.getElementById('date_a');
var podcast_order_arr = document.getElementById('podcast_ar');
var author_order_arr = document.getElementById('author_ar');
var email_order_arr = document.getElementById('email_ar');
var date_order_arr = document.getElementById('date_ar');
var author_order_dir = 'asc';
var email_order_dir = 'asc';
var date_order_dir = 'asc';
var podcast_order_dir = 'asc';

//var baseServerUrl = "http://postarecorder.pythonanywhere.com"
//var baseServerUrl = "http://127.0.0.1:8000"
var baseServerUrl;
if (location.protocol !== 'https:'){
	baseServerUrl = "http://postarecorder.pythonanywhere.com";
	//baseServerUrl = "http://127.0.0.1:8000"
}
else{
	baseServerUrl = "https://postarecorder.pythonanywhere.com";
	//baseServerUrl = "http://127.0.0.1:8000"
}

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

let f_tr = document.createElement('tr');
//f_tr.innerHTML = 
let td1 = '<td class="podcast"><b>Podcast</b></td>';
let td2 = '<td class="author"><b>Autor</b></td>';
let td3 = '<td class="email"><b>e-mail</b></td>';
let td4 = '<td class="dateStr"><b>Fecha</b></td>';
let td5 = '<td class="hourStr"><b>Hora</b></td>';
let td6 = '<td class="audiomsg" style="width: 25em;"><b>Mensaje</b></td>';
let td7 = '<td class="remove"></td>';
//f_tr.innerHTML = '<tr>' +  td1 + td2 + td3 + td4 + td5 + td6 + td7 + '</tr>';

let m_tr = document.getElementById('t_body');
m_tr.appendChild(f_tr);

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

                // Populate first row
                
 
                var options = {
                    valueNames: [
                        'audioName', 
                        'podcast', 
                        'author',
                        'email',
                        'dateStr',
                        //{attr: 'id', name:'audiomsg'} ]
                        'audiomsg',
                        'download',
                        'remove'],
                  };
                  
                  let firstAUd = '<audio controls="controls" src="' + j[0].audio_url + '" type="audio/mpeg">'; 
                  let fullHour = j[0].hour.length === 5? j[0].hour.slice(0, 1) : j[0].hour.slice(0, 2);
                  fullHour += ':' + j[0].hour.slice(-4, -2) + ':' + j[0].hour.slice(-2);
                  let fullDate = j[0].date.slice(0, 4) + '-' + j[0].date.slice(4, 6) + '-' + j[0].date.slice(6);
                  fullDate += ' ' + fullHour;

                  var values = [
                    {   audioName:j[0].audio_url, 
                        podcast: j[0].podcast.name, 
                        author:j[0].author_name,
                        email:j[0].author_email,
                        dateStr:fullDate,
                        audiomsg : firstAUd,
                        download : '<a href="' + j[0].audio_url + '" download target="_blank"> Descargar </a>',
                        remove: '<button class="remove-item-btn" onclick="butc(' + j[0].id + ')">Borrar</button>' }, 
                  ];
                  
                  hackerList = new List('hacker-list', options, values);
                  for(let i = 1; i < j.length; i++)
                  {
                      audio_i = '<audio controls="controls" src="' + j[i].audio_url + '" type="audio/mpeg">'; 
                      let down_i = '<a href="' + j[i].audio_url + '" download target="_blank"> Descargar </a>';
                      let fullHour_i = j[i].hour.length === 5? j[i].hour.slice(0, 1) : j[i].hour.slice(0, 2);
                      fullHour_i += ':' + j[i].hour.slice(-4, -2) + ':' + j[i].hour.slice(-2);
                      let fullDate_i = j[i].date.slice(0, 4) + '-' + j[i].date.slice(4, 6) + '-' + j[i].date.slice(6);
                      fullDate_i += ' ' + fullHour_i;
                      hackerList.add(
                        { audioName:j[i].audio_url, 
                            podcast: j[i].podcast.name, 
                            author:j[i].author_name,
                            email:j[i].author_email,
                            dateStr:fullDate_i,
                            audiomsg :audio_i,
                            download : down_i,
                            remove: '<button class="remove-item-btn" onclick="butc(' + j[i].id +  ')">Borrar</button>' }
                      );
                  }

                  let f_t = document.getElementById("f_t");
                  f_t.style.display = 'none';

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

//Ordering actions
podcast_order.addEventListener('click', ()=>{
    if(podcast_order_dir === 'desc')
    {
        podcast_order_dir = 'asc';
        podcast_order_arr.className = "";
        podcast_order_arr.className = "triangleDivUp";
    }
    else
    {
        podcast_order_dir = 'desc';
        podcast_order_arr.className = "triangleDivDown";
    }
});

author_order.addEventListener('click', ()=>{
    if(author_order_dir === 'desc')
    {
        author_order_dir = 'asc';
        author_order_arr.className = "";
        author_order_arr.className = "triangleDivUp";
    }
    else
    {
        author_order_dir = 'desc';
        author_order_arr.className = "triangleDivDown";
    }
})

email_order.addEventListener('click', ()=>{
    if(email_order_dir === 'desc')
    {
        email_order_dir = 'asc';
        email_order_arr.className = "";
        email_order_arr.className = "triangleDivUp";
    }
    else
    {
        email_order_dir = 'desc';
        email_order_arr.className = "triangleDivDown";
    }
})

date_order.addEventListener('click', ()=>{
    if(date_order_dir === 'desc')
    {
        date_order_dir = 'asc';
        date_order_arr.className = "";
        date_order_arr.className = "triangleDivUp";
    }
    else
    {
        date_order_dir = 'desc';
        date_order_arr.className = "triangleDivDown";
    }
})