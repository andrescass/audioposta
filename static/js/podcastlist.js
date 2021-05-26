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

var deleting_entry_id = -1;
var deleting_idx = -1;

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
                var salute = document.getElementById("podcaster_name");
                salute.innerHTML=j.username;
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
let m_table = document.getElementById('dataTable');
//m_tr.appendChild(f_tr);

// Show podcast list
function showLists()
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

                  for(let i = 0; i < j.length; i++)
                  {
                      audio_i = '<audio controls="controls" src="' + j[i].audio_url + '" type="audio/mpeg">';
                      let down_i = '<a href="' + baseServerUrl + "/api/audio-get/" +  j[i].audio_url.split('/').slice(-1) + '" download target="_blank" class="iconos-player"><i class="fas fa-file-download"></i></a>';
                      let fullHour_i = j[i].hour.length === 5? j[i].hour.slice(0, 1) : j[i].hour.slice(0, 2);
                      fullHour_i += ':' + j[i].hour.slice(-4, -2) + ':' + j[i].hour.slice(-2);
                      let fullDate_i = j[i].date.slice(0, 4) + '-' + j[i].date.slice(4, 6) + '-' + j[i].date.slice(6);
                      fullDate_i += ' ' + fullHour_i;

                      let f_tr = document.createElement('tr');
                        let td1 = '<td class="podcast"><b>' + j[i].podcast.name + '</b></td>';
                        let td2 = '<td class="author"><b>' + j[i].author_name + '</b></td>';
                        let td3 = '<td class="email"><b>' + j[i].author_email + '</b></td>';
                        let td4 = '<td class="dateStr"><b>' + fullDate_i + '</b></td>';
                        let td5 = '<td class="audiomsg" style="width: 25em;"><b>' + audio_i + '</b></td>';
                        let td6 = '<td class="download">' + down_i + '</td>';
                        let td7 = '<td class="remove"><a href="#" class="iconos-player" data-toggle="modal" data-target="#borrarModal" onclick="butc(' + j[i].id + "," + i +  ')"><i class="fas fa-trash-alt"></i></a></td>';

                        f_tr.innerHTML = '<tr id="' + i + '">' +  td1 + td2 + td3 + td4 + td5 + td6 + td7 + '</tr>';
                        m_tr.appendChild(f_tr);

                  }

                  //let f_t = document.getElementById("f_t");
                  //f_t.style.display = 'none';

                  //let buttons = document.getElementsByClassName("remove-item-btn");
                //return hackerList;
                $('#dataTable').DataTable();
            })
        }
        else{
            console.log('Usuario o contraseña incorrecto');
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
}

/*function showLists(hackerList)
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
                        //download : '<a href="' + j[0].audio_url + '" download target="_blank"> Descargar </a>',
                        download : '<a href="' + baseServerUrl + "/api/audio-get/" +  j[0].audio_url.split('/').slice(-1) + '" download target="_blank class="iconos-player"><i class="fas fa-file-download"></i></a>',
                        //remove: '<button class="remove-item-btn" onclick="butc(' + j[0].id + ')">Borrar</button>'
                        remove : '<a href="#" class="iconos-player" data-toggle="modal" data-target="#borrarModal"><i class="fas fa-trash-alt"></i></a>'},
                  ];

                  hackerList = new List('hacker-list', options, values);
                  for(let i = 1; i < j.length; i++)
                  {
                      audio_i = '<audio controls="controls" src="' + j[i].audio_url + '" type="audio/mpeg">';
                      let down_i = '<a href="' + baseServerUrl + "/api/audio-get/" +  j[i].audio_url.split('/').slice(-1) + '" download target="_blank class="iconos-player"><i class="fas fa-file-download"></i></a>';
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
                            remove: '<a href="#" class="iconos-player" data-toggle="modal" data-target="#borrarModal"><i class="fas fa-trash-alt"></i></a>'},
                      );
                  }

                  let f_t = document.getElementById("f_t");
                  f_t.style.display = 'none';

                  let buttons = document.getElementsByClassName("remove-item-btn");
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
}*/

// Log out action: get back to log in page and delete token
logout_link.addEventListener("click", () => {
    localStorage.removeItem('posta_token');
    }
)

// Change password action
/*pass_link.addEventListener("click", () => {
    window.location.replace(baseServerUrl+'/podcaster/changepassword');
    }
)*/

function butc(p_id, i){
    deleting_id = p_id;
    deleting_idx = i;
}

document.getElementById('cancel_del').addEventListener("click", () => {
    deleting_id = -1;
})

document.getElementById('accept_del').addEventListener("click", () => {
    if(deleting_id > -1)
    {
        fetch(baseServerUrl+"/api/entry-delete/"+deleting_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.posta_token
            }
        }).then( response => {
            if(response.ok)
            {
                deleting_id = -1;
                if(deleting_idx > -1)
                {
                    m_table.deleteRow(deleting_idx);
                    deleting_idx = -1;

                }

                $('#dataTable').DataTable();
                /*(function($) {
                    "use strict";
                    $('#dataTable').DataTable();
                })(jQuery);*/
                window.location.reload(true);
                //location.reload();
                //m_tr.innerHTML = '';
                //showLists();
                //
            }
            else{
                alert("Ocurrió un error al borrar el mensaje");
            }
            });
    }
})


//Ordering actions
/*podcast_order.addEventListener('click', ()=>{
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
})*/