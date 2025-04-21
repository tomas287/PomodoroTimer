let targetDate;
let timeLeft = 0;
let timeLeftWhenPaused;
let isItPaused = false;

const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const pauseButton = document.getElementById('pause');


startButton.addEventListener('click', () => {
    unpauseCountdown();
    showPauseButton();
    if (timeLeft > 0 ) {
        resumeCountdown();
    }
    else
        startCountdown();
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

function pauseCountdown() {
    isItPaused = true;
}

function unpauseCountdown() {
    isItPaused = false;
}

function startCountdown() {
    targetDate = new Date().getTime() + (1000 * 60 * 25);
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
            document.getElementById("countdown").innerHTML = "The event has started!";
        }
    }
}