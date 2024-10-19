// Target date for the countdown timer (Date object, not string)
const targetDate = new Date("2026-06-07T13:00:00Z"); // ISO format for UTC

// Function to retrieve elements
const getTimeDigitElements = (digitElement) => {
  const digitDisplayTop = digitElement.querySelector(".digit-display__top");
  const digitDisplayBottom = digitElement.querySelector(
    ".digit-display__bottom"
  );
  const digitOverlay = digitElement.querySelector(".digit-overlay");
  const digitOverlayTop = digitOverlay.querySelector(".digit-overlay__top");
  const digitOverlayBottom = digitOverlay.querySelector(
    ".digit-overlay__bottom"
  );

  return {
    digitDisplayTop,
    digitDisplayBottom,
    digitOverlay,
    digitOverlayTop,
    digitOverlayBottom,
  };
};

// Update the display and overlay values
const updateDigitValues = (displayElement, overlayElement, value) => {
  displayElement.textContent = value;
  overlayElement.textContent = value;
};

// Update the digits with a flip effect
const updateTimeDigit = (digitElement, timeValue) => {
  const {
    digitDisplayTop,
    digitDisplayBottom,
    digitOverlay,
    digitOverlayTop,
    digitOverlayBottom,
  } = getTimeDigitElements(digitElement);

  if (parseInt(digitDisplayTop.textContent, 10) === timeValue) return;

  digitOverlay.classList.add("flip");
  updateDigitValues(digitDisplayTop, digitOverlayBottom, timeValue);

  const finishAnimation = () => {
    digitOverlay.classList.remove("flip");
    updateDigitValues(digitDisplayBottom, digitOverlayTop, timeValue);
    digitOverlay.removeEventListener("animationend", finishAnimation);
  };

  digitOverlay.addEventListener("animationend", finishAnimation);
};

// Update the time section (days, hours, minutes, seconds)
const updateTimeSection = (sectionID, timeValue) => {
  const sectionElement = document.getElementById(sectionID);
  const timeDigits = sectionElement.querySelectorAll(".digit-container");

  const [hundreds, tens, ones] = [
    Math.floor(timeValue / 100),
    Math.floor((timeValue % 100) / 10),
    timeValue % 10,
  ];

  const digitValues =
    sectionID === "days"
      ? [hundreds, tens, ones]
      : [Math.floor(timeValue / 10), timeValue % 10];

  digitValues.forEach((digitValue, index) => {
    if (timeDigits[index]) {
      updateTimeDigit(timeDigits[index], digitValue);
    }
  });

  if (sectionID === "days" && timeValue >= 100 && timeDigits.length < 3) {
    const newDigitContainer = document.createElement("div");
    newDigitContainer.classList.add("digit-container");
    newDigitContainer.innerHTML = `
      <div class="digit-display">
        <div class="digit-display__top">0</div>
        <div class="digit-display__bottom">0</div>
        <div class="digit-overlay">
          <div class="digit-overlay__top">0</div>
          <div class="digit-overlay__bottom">0</div>
        </div>
      </div>`;
    sectionElement.querySelector(".time-group").appendChild(newDigitContainer);
  } else if (timeValue < 100 && timeDigits.length === 3) {
    timeDigits[2].remove();
  }
};

// Calculate the remaining time until the target date
const getTimeRemaining = (targetDateTime) => {
  const now = new Date(); // Current time as a Date object
  const secondsRemaining = Math.floor((targetDateTime - now) / 1000); // Time difference in seconds

  if (secondsRemaining <= 0) {
    return { complete: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    complete: false,
    days: Math.floor(secondsRemaining / (60 * 60 * 24)),
    hours: Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60)),
    minutes: Math.floor((secondsRemaining % (60 * 60)) / 60),
    seconds: secondsRemaining % 60,
  };
};

// Update the countdown timer display
const updateCountdown = () => {
  const timeRemaining = getTimeRemaining(targetDate);

  updateTimeSection("days", timeRemaining.days);
  updateTimeSection("hours", timeRemaining.hours);
  updateTimeSection("minutes", timeRemaining.minutes);
  updateTimeSection("seconds", timeRemaining.seconds);

  return timeRemaining.complete;
};

// Set up an interval to update the countdown every second
const countdownTimer = setInterval(() => {
  if (updateCountdown()) clearInterval(countdownTimer);
}, 1000);

// Initial countdown update
updateCountdown();
