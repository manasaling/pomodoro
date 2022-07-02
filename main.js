const timer = {
  pomodoro: 0.1,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};


var counter = 1;
var timeElpased = 25;



let interval;


const buttonSound = new Audio('button-sound.mp3');
const workMusic = new Audio('lofi-study.mp3');
const breakMusic = new Audio('break-music.mp3');
const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
buttonSound.play();
const { action } = mainButton.dataset;
if (action === 'start') {
  startTimer();
  if (timer.mode === 'pomodoro'){
    workMusic.play();
   }
  else{
    breakMusic.play();
  }
} else {
  stopTimer();
  if (timer.mode === 'pomodoro'){
    workMusic.pause();
  }
  else{
    breakMusic.pause();
  }
}
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);


// remianing time
function getRemainingTime(endTime) {
const currentTime = Date.parse(new Date());
const difference = endTime - currentTime;

const total = Number.parseInt(difference / 1000, 10);
const minutes = Number.parseInt((total / 60) % 60, 10);
const seconds = Number.parseInt(total % 60, 10);

return {
  total,
  minutes,
  seconds,
};
}


// start the timer
function startTimer() {
  
let { total } = timer.remainingTime;
const endTime = Date.parse(new Date()) + total * 1000;

if (timer.mode === 'pomodoro'){
  timer.sessions++;
  //code
  //totalCount.innerHTML = count;
  //workSession++
  //document.getElementById('work-session').innerHTML = workSession;
  //code
}
mainButton.dataset.action = 'stop';
mainButton.textContent = 'stop';
mainButton.classList.add('active');

interval = setInterval(function() {
  timer.remainingTime = getRemainingTime(endTime);
  updateClock();

  total = timer.remainingTime.total;
  if (total <= 0) {
    //my code
      //if(timer.mode === 'pomodoro'){
      // workSessions++;
     // }
    //my code

    clearInterval(interval);
    
    const sessions = document.getElementById('js-sessions');
    sessions.textContent = counter;
    const totalTime = document.getElementById('js-totalTime');
    totalTime.textContent = timeElpased;

    switch (timer.mode) {
      case 'pomodoro':
        if (timer.sessions % timer.longBreakInterval === 0) {
          counter++
          timeElpased += 25;
          switchMode('longBreak');
            workMusic.pause();
            breakMusic.play();
        } else {
            counter++
            timeElpased += 25;
            switchMode('shortBreak');
            workMusic.pause();
            breakMusic.play();
        }
        break;
      default:
        switchMode('pomodoro');
        breakMusic.pause();
    }

    if (Notification.permission === 'granted') {
      const text =
        timer.mode === 'pomodoro' ? 'time to work!' : 'break time!';
      new Notification(text);
    }

    document.querySelector(`[data-sound="${timer.mode}"]`).play();

    startTimer();
  }
}, 1000);
}



// stops timer
function stopTimer() {
clearInterval(interval);

mainButton.dataset.action = 'start';
mainButton.textContent = 'start';
mainButton.classList.remove('active');
}


// updates clock
function updateClock() {
const { remainingTime } = timer;
const minutes = `${remainingTime.minutes}`.padStart(2, '0');
const seconds = `${remainingTime.seconds}`.padStart(2, '0');

const min = document.getElementById('js-minutes');
const sec = document.getElementById('js-seconds');
min.textContent = minutes;
sec.textContent = seconds;

const text =
  timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
document.title = `${minutes}:${seconds} — ${text}`;

const progress = document.getElementById('js-progress');
progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

// swtitches between modes
function switchMode(mode) {
timer.mode = mode;
timer.remainingTime = {
  total: timer[mode] * 60,
  minutes: timer[mode],
  seconds: 0,
};

document
  .querySelectorAll('button[data-mode]')
  .forEach(e => e.classList.remove('active'));
document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
document.body.style.backgroundColor = `var(--${mode})`;
document
  .getElementById('js-progress')
  .setAttribute('max', timer.remainingTime.total);

updateClock();
}

function handleMode(event) {
const { mode } = event.target.dataset;

if (!mode) return;

switchMode(mode);
stopTimer();
}

document.addEventListener('DOMContentLoaded', () => {
if ('Notification' in window) {
  if (
    Notification.permission !== 'granted' &&
    Notification.permission !== 'denied'
  ) {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        new Notification(
          'Awesome! You will be notified at the start of each session'
        );
      }
    });
  }
}

switchMode('pomodoro');
});

