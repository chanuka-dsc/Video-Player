'use strict'

const video = document.getElementById('video');
const videoSettings = document.getElementById('video-controls');

const videoWorks = !!document.createElement('video').canPlayType; //!! symbols are to convert the variable in to a boolean 


if (videoWorks) {
video.controls = false;
videoSettings.classList.remove('hidden');
}

const playBtn = document.getElementById('play');

// creating the toggle play button

const  togglePlay = function () {
   
    if(video.paused || video.ended){ // returns true if the video is paused or eneded 
        video.play();
    }else {
        video.pause();
    }
}

//the eventlistner for the play button
playBtn.addEventListener('click',togglePlay);

const playbackIcons = document.querySelectorAll('.playback-icons use'); // this means the buttons in the playback-icons class with the use tag

//toggle playbutton icon play and pause

const updatePlayButton = function () {
    playbackIcons.forEach(icon => icon.classList.toggle('hidden'));

    //Change the tool tip discription of the cursor
    if(video.paused){
        playBtn.setAttribute('data-title','play (k)');
    }else {
        playBtn.setAttribute('data-title','pause (k)');
    }
}

// adding the eventlistner to change the button when the video plays pauses 

video.addEventListener('play',updatePlayButton);
video.addEventListener('pause',updatePlayButton);

//displaying the time elapsed and the duration

const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');

//fucntion to conver seconds to minutes and seconds

//attemted a solution of my own  but didnt support the future functionaities 
// const convertTime = function (seconds) {
//     const min = String(Math.floor(seconds/60)).padStart(2,0);
//     const sec = String(seconds % 60).padStart(2,0);

//     return {
//         minutes : min,
//         seconds : sec
//     }
// }

const convertTime = function (timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8); //creates a new time and date variable, converts to an ISO string then takes only from character 11 up to newxt 8 characters
    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
  };

//initializing the duration and progressbar

const initializeVideo = function () {
    
    const videoDuration = Math.round(video.duration);
    //adding the max attribute to the progress bar
    progressBar.setAttribute('max',videoDuration);
    seek.setAttribute('max',videoDuration);

    //intializing the duration
    const time = convertTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime',`${time.minutes}m ${time.seconds}s`);
}

// adding the eventlistner to initialize the video

video.addEventListener('loadeddata', initializeVideo);

//Updating the current time

const updateTime = function () {
    const time = convertTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`
    timeElapsed.setAttribute('datetime',`${time.minutes}m ${time.seconds}s`)
}

// Adding the eventlistner to update the current time 

video.addEventListener('timeupdate',updateTime);

// developing the progress bar 

const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');

//function to update progress 

const updateProgress = function () {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
}

// creating the eventlistner to update the progress bar

video.addEventListener('timeupdate',updateProgress);

// intergrating the skeeing option

const seekToolTip = document.getElementById('seek-tooltip');


function updateSeekTooltip(event) {
    const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
    seek.setAttribute('data-seek', skipTo)
    const t = convertTime(skipTo);
    seekToolTip.textContent = `${Number(t.minutes)}:${Number(t.seconds)}`;
    const rect = video.getBoundingClientRect();
    seekToolTip.style.left = `${event.pageX - rect.left}px`;
  }

  seek.addEventListener('mousemove', updateSeekTooltip);

  //skiping ahead

  const skipAhead =  function (event) {
    const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
  }

  seek.addEventListener('input', skipAhead);

//developing the volume button 

const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use')
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumehigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');

// function to change voulme 

const changeVolume = function () {
    if(video.muted){
        video.muted = false;
    }

    video.volume = volume.value;
}

volume.addEventListener('input',changeVolume);

//updating the volume icon

const updateVolIcon = function () {
    volumeIcons.forEach(element => element.classList.add('hidden'));

    volumeButton.setAttribute('data-title','mute (m)');

    if(video.muted || video.volume === 0 ){
        volumeMute.classList.remove('hidden');
        volumeButton.setAttribute('data-title','Un-mute (m)');
    }else if (video.volume > 0 && video.volume < 0.5) {
        volumeLow.classList.remove('hidden');
    }else {
        volumehigh.classList.remove('hidden');
    }
}

video.addEventListener('volumechange',updateVolIcon);

// dadding the mute and unmute functions to the volume button

const toggleMute = function () {
    
    video.muted = !video.muted

    if(video.muted){
        volume.setAttribute('data-volume',volume.vlaue)
        volume.value = 0;
    }else {
        volume.value=volume.dataset.value;
    }
}

volumeButton.addEventListener('click',toggleMute)

//Adding the click video to play/pause function

video.addEventListener('click',togglePlay);

//adding the play back animations

const playbackAnimation = document.getElementById('playback-animation');
console.log(playbackAnimation);
function animatePlayback() {
    playbackAnimation.animate([
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      }], {
      duration: 500,
    });
  }

  video.addEventListener('click', animatePlayback);

//implementing the full screean functionality 
  const fullScreanBtn = document.getElementById('fullscreen-button')
  const videoContainer = document.getElementById('video-container')

  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      // Need this to support Safari
      document.webkitExitFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      // Need this to support Safari
      videoContainer.webkitRequestFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  }

  fullScreanBtn.addEventListener('click',toggleFullScreen)

console.log('The project is not complete');