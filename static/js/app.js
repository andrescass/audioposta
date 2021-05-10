//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

//var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

// Auxiliar flags
var hasRecorded = false;
var baseServerUrl = "https://postarecorder.pythonanywhere.com"

// Timers
var upTime = document.getElementById("up_timer");
var downTime = document.getElementById("down_timer");
var timerUp;
var timerDown;
var upChronometerCall;
var downChronometerCall;

upTime.innerHTML = "0:00";
downTime.innerHTML = "2:00";

function startRecording() {

	if(hasRecorded)
	{
		recordingsList.innerHTML = '';
		hasRecorded = false;
	}

	console.log("startRecording() called");

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		//__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device
		*/
		audioContext = new AudioContext();

		//update the format 
		//document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		//encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		//encodingType = "Waveform Audio (.wav)";
		encodingType = "mp3";// (MPEG-1 Audio Layer III) (.mp3)";
		//encodingType = "Ogg Vorbis (.ogg)";
		
		//disable the encoding selector
		//encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "../static/js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
			console.log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
			console.log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			//__log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			//encodingTypeSelect.disabled = false;
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

		//start the recording process
		recorder.startRecording();

		 //__log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
		//__log("Exception");
        console.log(err)
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	timerUp = 0;
	timerDown = 120;
	upTime.innerHTML = "0:00";
	downTime.innerHTML = "2:00";
	upChronometerCall = setInterval(upChronometer, 1000)
	downChronometerCall = setInterval(downChronometer, 1000)

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	stopButton.disabled = true;
	recordButton.disabled = false;

	clearInterval(upChronometerCall);
	clearInterval(downChronometerCall);
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	//__log('Recording stopped');
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	var but = document.createElement('button')

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	// Button to upload
	but.innerHTML = "Enviar"
	but.name = "sendBut"
	but.onclick = function () {
		let email = document.getElementById('id_email').value;
		let name = document.getElementById('id_name').value;
		let podcast = document.getElementById('id_podcast').options[document.getElementById('id_podcast').selectedIndex].value;
		var now = new Date();
		var months = `${now.getMonth()+1}`.length < 2 ? `0${now.getMonth()+1}`:`${now.getMonth()+1}`;
		var day = `${now.getDate()}`.length < 2 ? `0${now.getDate()}`:`${now.getDate()}`;
		var full_date = `${now.getFullYear()}${months}${day}`;
		var minutes = `${now.getMinutes()}`.length < 2 ? `0${now.getMinutes()}`:`${now.getMinutes()}`;
		var seconds = `${now.getSeconds()}`.length < 2 ? `0${now.getSeconds()}`:`${now.getSeconds()}`;
		var hours = `${now.getHours()}${minutes}${seconds}`;
		var filename = podcast + '_' + full_date + hours;
		var xhr = new XMLHttpRequest();
    	xhr.onload = function(e) {
			if (this.readyState === 4) {
				logg = baseServerUrl + JSON.parse(e.target.responseText)["audioFile"];
				console.log("Server returned: ", logg);

				fetch(baseServerUrl+"/api/entry-post/", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						"author_email": email,
						"author_name": name,
						"podcast" : podcast,
						"date" : full_date,
						"hour" : hours,
						"audio_url" : logg

					})
				}).then( response => {
					console.log(response.json());
					if(response.ok)
					{
						recordingsList.innerHTML = "";
						timerUp = 0;
						timerDown = 120;
						upTime.innerHTML = "0:00";
						downTime.innerHTML = "2:00";
					}
				}).then(data => {
					console.log(data);
				}).catch((error) => {
					console.error('Error:', error);
				});
			}
		};
		var fd = new FormData();
		fd.append("audioFile", blob, filename+ '-' +encoding);
		xhr.open("POST", baseServerUrl+"/api/audio-post/", true);
		xhr.send(fd);
		
	}


	//add the new audio and a elements to the li element
	li.appendChild(au);
	//li.appendChild(link);
	li.appendChild(but);

	//add the li element to the ordered list
	recordingsList.appendChild(li);

	hasRecorded = true;


	
}

// Timers implementation
function upChronometer() {

    timerUp ++;

	let minutes = Math.floor(timerUp / 60);
	let seconds = timerUp % 60;

	if(seconds < 10)
	{
    	upTime.innerHTML = `${minutes}:0${seconds}`
	}
	else{
		upTime.innerHTML = `${minutes}:${seconds}`
	}

	if(timerUp > 119)
	{
		stopRecording();
		downTime.innerHTML = `0:00`
	}
}

function downChronometer() {

    timerDown--;

	let minutes = Math.floor(timerDown / 60);
	let seconds = timerDown % 60;

	if(seconds < 10)
	{
    	downTime.innerHTML = `${minutes}:0${seconds}`
	}
	else
	{
		downTime.innerHTML = `${minutes}:${seconds}`
	}
}

//helper function
/*function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}*/
