const POMODORO = "pomodoro";
const SHORT_BREAK = "shortBreak";
const LONG_BREAK = "longBreak";
const SHORT_BREAK_MSG = "Time to take a short break.";
const LONG_BREAK_MSG = "Time to take a long break.";
const POMODORO_MSG = "Time to focus on your work.";
const POMODORO_DEFAULT_DURATION = 25;
const SHORT_BREAK_DEFAULT_DURATION = 5;
const LONG_BREAK_DEFAULT_DURATION = 15;


let targetDate;
let timeLeft = 0;
let timeLeftWhenPaused;
let isItPaused = false;
let pomodorosCounter = 1;
let pomodorosBeforeLongBreak = 4;
let currentCyclePomodoros = 0;


const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const pauseButton = document.getElementById('pause');

const navContainer = document.getElementById('modesMenu');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('shortBreak');
const longBreakButton = document.getElementById('longBreak');

const settingsButton = document.getElementById('settings');
const returnButton = document.getElementById('return');
const saveChangesButton = document.getElementById('saveChangesButton');

const mainView = document.getElementById("mainView");
const settingsView = document.getElementById("settingsView");
const faqContainer = document.getElementById("faqContainer");

const inputTimes = document.querySelectorAll('.inputTimes');

let currentMode = POMODORO;
let modes = {
    [POMODORO]: POMODORO_DEFAULT_DURATION,
    [SHORT_BREAK]: SHORT_BREAK_DEFAULT_DURATION,
    [LONG_BREAK]: LONG_BREAK_DEFAULT_DURATION
};

pomodoroButton.addEventListener('click' ,function (e) {
    if (currentMode != POMODORO) {
        startPomodoro();
    }
});

shortBreakButton.addEventListener('click' ,function (e) {
    if (currentMode != SHORT_BREAK) {
        startShortBreak();
    }
});

longBreakButton.addEventListener('click' ,function (e) {
    if (currentMode != LONG_BREAK) {
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
        startCountdown();
    }
  });

restartButton.addEventListener('click', () => {
    showPauseButton();
    resetCountdown();
    unpauseCountdown();
    startCountdown();
});

pauseButton.addEventListener('click', () => {
    pause();
});

settingsButton.addEventListener('click', () => {
    pause();

    mainView.style.display = "none";
    faqContainer.classList.replace('d-block', 'd-none');
    settingsView.style.display = "block";
});

returnButton.addEventListener('click', () => {
    if (timeLeft == 0) {
        showInitialButton();
    }

    mainView.style.display = "block";
    faqContainer.classList.replace('d-none', 'd-block');
    settingsView.style.display = "none";
});

saveChangesButton.addEventListener('click', () => {
    const pomodoroInput = parseFloat(document.getElementById('pomodoroInput').value);
    const shortBreakInput = parseFloat(document.getElementById('shortBreakInput').value);
    const longBreakInput = parseFloat(document.getElementById('longBreakInput').value);

    if (currentMode == POMODORO && pomodoroInput != modes[POMODORO])
        resetCountdown();

    if (currentMode == SHORT_BREAK && shortBreakInput != modes[SHORT_BREAK])
        resetCountdown();

    if (currentMode == LONG_BREAK && longBreakInput != modes[LONG_BREAK])
        resetCountdown();

    modes[POMODORO] = pomodoroInput;
    modes[SHORT_BREAK] = shortBreakInput;
    modes[LONG_BREAK] = longBreakInput;

    if (timeLeft == 0) {
        document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";
    }
});

inputTimes.forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (['.', ',', 'e', '-', '+'].includes(e.key)) {
        e.preventDefault();
      }
    });
  });

function pause() {
    showStartButton();
    pauseCountdown();
    const now = new Date().getTime();
    timeLeftWhenPaused = targetDate - now;
}

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

function resetCountdown() {
    timeLeft = 0;
    timeLeftWhenPaused = 0;
}

function startShortBreak() {
    makeButtonActive(shortBreakButton);
    currentMode = SHORT_BREAK;
    pauseCountdown();
    resetCountdown();
    showInitialButton();
    giveShortBreakColors();
    document.getElementById("pomodoroText").innerHTML = SHORT_BREAK_MSG;
    document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";

    console.log(((pomodorosCounter - 1) % pomodorosBeforeLongBreak))

    if ((pomodorosCounter - 1) == 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>No pomodoros completed.</h6>\n"
        +"Looks like you haven't finished any pomodoros yet. Time to get back to work.";
    else if (currentCyclePomodoros == 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Break time's over.</h6>\n"
        +"You already took a long break for the last cycle. Let's get back to work!";
    else if (((pomodorosCounter - 1) % pomodorosBeforeLongBreak) != 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Time for a " + modes[currentMode] + "-minute break.</h6>\n"
        +"You've completed " + (pomodorosCounter - 1)%4 + " out of " + pomodorosBeforeLongBreak + " pomodoros. Enjoy your short break!";
    else
       document.getElementById("pomodoroInfo").innerHTML = "<h6>Well done.</h6>\n"
        +"That's " + (pomodorosCounter - 1) + " pomodoros down. Take that longer break!"; 
    
}

function startLongBreak() {
    makeButtonActive(longBreakButton);
    currentMode = LONG_BREAK;
    pauseCountdown();
    resetCountdown();
    showInitialButton();
    giveLongBreakColors();
    document.getElementById("pomodoroText").innerHTML = LONG_BREAK_MSG;
    document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";

    
    if ((pomodorosCounter - 1) == 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>No pomodoros completed.</h6>\n"
        +"Looks like you haven't finished any pomodoros yet. Time to get back to work.";
    else if (currentCyclePomodoros == 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Break time's over.</h6>\n"
        +"You already took a long break for the last cycle. Let's get back to work!";
    else if (((pomodorosCounter - 1) % pomodorosBeforeLongBreak) != 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Almost there.</h6>\n"
        +"You've completed " + (pomodorosCounter - 1)%4 + " out of " + pomodorosBeforeLongBreak + " pomodoros. Long break comes later — take a shorter break or keep going!";
    else
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Time for a " + modes[currentMode] + "-minute break.</h6>\n"
        +"You've completed <b>" + (pomodorosCounter - 1) + " out of " + pomodorosBeforeLongBreak + "</b> pomodoros. Enjoy your well-deserved long break!";

}

function startPomodoro() {
    makeButtonActive(pomodoroButton);
    currentMode = POMODORO;
    pauseCountdown();
    resetCountdown();
    showInitialButton();
    givePomodoroColors();
    document.getElementById("pomodoroText").innerHTML = POMODORO_MSG;
    document.getElementById("countdownText").innerHTML = modes[currentMode] + ":00";

    if ((pomodorosCounter%4) == 0)
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Pomodoro #" + pomodorosCounter + "</h6>"
        + "Last pomodoro before your long break!";
    else
        document.getElementById("pomodoroInfo").innerHTML = "<h6>Pomodoro #" + pomodorosCounter + "</h6>"
            + pomodorosCounter%4 + " out of " + pomodorosBeforeLongBreak + " pomodoros until your long break.";
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
            if (currentMode == POMODORO) {
                currentCyclePomodoros++;
                pomodorosCounter++;
                if (((pomodorosCounter - 1) % pomodorosBeforeLongBreak) == 0)
                    startLongBreak();
                else
                    startShortBreak();
            }
            else {
                if (currentMode == LONG_BREAK)
                    currentCyclePomodoros = 0;
                
                startPomodoro();
            }
        }
    }
}

function makeButtonActive (button) {
    navContainer.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    button.classList.add('active');
}

function givePomodoroColors() {
    document.documentElement.setAttribute("data-theme", "default");
}

function giveShortBreakColors() {
    document.documentElement.setAttribute("data-theme", SHORT_BREAK);
}

function giveLongBreakColors() {
    document.documentElement.setAttribute("data-theme", LONG_BREAK);
}

window.onload = startPomodoro();