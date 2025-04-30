const POMODORO = "pomodoro";
const SHORT_BREAK = "shortBreak";
const LONG_BREAK = "longBreak";
const SHORT_BREAK_MSG = "It's time to take a short break.";
const LONG_BREAK_MSG = "It's time to take a longer break.";
const POMODORO_MSG = "It's time to focus.";

let targetDate;
let timeLeft = 0;
let timeLeftWhenPaused;
let isItPaused = false;
let consecutivePomodoros = 0;


const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const pauseButton = document.getElementById('pause');

const navContainer = document.getElementById('modesMenu');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('shortBreak');
const longBreakButton = document.getElementById('longBreak');

let currentMode = POMODORO;
let modes = {
    [POMODORO]: 25,
    [SHORT_BREAK]: 5,
    [LONG_BREAK]: 15
};

pomodoroButton.addEventListener('click' ,function (e) {
    if (currentMode != POMODORO) {
        makeButtonActive(this);
        startPomodoro();
    }
});

shortBreakButton.addEventListener('click' ,function (e) {
    if (currentMode != SHORT_BREAK) {
        makeButtonActive(this);
        startShortBreak();
    }
});

longBreakButton.addEventListener('click' ,function (e) {
    if (currentMode != LONG_BREAK) {
        makeButtonActive(this);
        startLongBreak();
    }
});

startButton.addEventListener('click', () => {
    unpauseCountdown();
    showPauseButton();
    if (timeLeft > 0 ) {
        resumeCountdown();
    }
    else {
        if (currentMode == POMODORO)
            consecutivePomodoros++;

        startCountdown();
    }
  });

restartButton.addEventListener('click', () => {
    showPauseButton();
    timeLeft = 0;
    timeLeftWhenPaused = 0;

    unpauseCountdown();
    startCountdown();
});

pauseButton.addEventListener('click', () => {
    showStartButton();
    pauseCountdown();
    const now = new Date().getTime();
    timeLeftWhenPaused = targetDate - now;
});

function showPauseButton() {
    pauseButton.style.display = "flex";
    restartButton.style.display = "flex";
    startButton.style.display = "none";
}

function showStartButton() {
    startButton.style.display = "flex";
    pauseButton.style.display = "none";
    restartButton.style.display = "flex";
}

function showInitialButton() {
    startButton.style.display = "flex";
    pauseButton.style.display = "none";
    restartButton.style.display = "none";
}

function pauseCountdown() {
    isItPaused = true;
}

function unpauseCountdown() {
    isItPaused = false;
}

function startShortBreak() {
    currentMode = SHORT_BREAK;
    pauseCountdown();
    showInitialButton();
    document.getElementById("pomodoroText").innerHTML = SHORT_BREAK_MSG;
    document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";
}

function startLongBreak() {
    currentMode = LONG_BREAK;
    consecutivePomodoros = 0;
    pauseCountdown();
    showInitialButton();
    document.getElementById("pomodoroText").innerHTML = LONG_BREAK_MSG;
    document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";
}

function startPomodoro() {
    currentMode = POMODORO;
    pauseCountdown();
    showInitialButton();
    document.getElementById("pomodoroText").innerHTML = POMODORO_MSG;
    document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";
}

function startCountdown() {
    // targetDate = new Date().getTime() + (1000 * 60 * 25);
    targetDate = new Date().getTime() + (1000 * 60 * modes[currentMode]);
    updateCountdown();
}

function resumeCountdown() {
    targetDate = new Date().getTime() + timeLeftWhenPaused;
    updateCountdown();
}

// Countdown function to update the timer
function updateCountdown() {
    if (!isItPaused) {
        const now = new Date().getTime();
        timeLeft = targetDate - now;

        // Calculate minutes, and seconds
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.max(0, Math.ceil((timeLeft % (1000 * 60)) / 1000));

        if (seconds >= 60) {
            seconds = seconds - 60;
            minutes++;
        }

        const paddedSeconds = String(seconds).padStart(2, '0');

        // Display the result in the countdown div
        document.getElementById("countdownText").innerHTML = minutes + ":" + paddedSeconds;

        // Check if the countdown has ended
        if (timeLeft > 0) {
            setTimeout(updateCountdown, 1000); // Call updateCountdown again after 1 second
        } else {
            if (currentMode == POMODORO)
                if (consecutivePomodoros == 4)
                    startLongBreak();
                else
                    startShortBreak();
            else
                startPomodoro();
        }
    }
}

function makeButtonActive (button) {
    navContainer.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    button.classList.add('active');
}

window.onload = startPomodoro();