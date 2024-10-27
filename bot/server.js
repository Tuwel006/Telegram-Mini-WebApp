const fs = require("fs");
const path = require("path");

// Define the countdown start time (8 hours in milliseconds)
let countdown = 8 * 60 * 60 * 1000;

// Function to update the JSON file with the current countdown time
const updateCountdown = () => {
  // Decrement countdown by 1 second (1000 ms)
  countdown -= 1000;

  // Get hours, minutes, and seconds from countdown
  const hours = Math.floor((countdown / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((countdown / (1000 * 60)) % 60);
  const seconds = Math.floor((countdown / 1000) % 60);

  const timeLeft = {
    hours,
    minutes,
    seconds
  };

  // Write the updated countdown to a JSON file
  const filePath = path.join(__dirname, "timer.json");
  fs.writeFileSync(filePath, JSON.stringify(timeLeft, null, 2));

  console.log("Countdown updated:", timeLeft);

  // If countdown reaches zero, stop the timer
  if (countdown <= 0) {
    clearInterval(timer);
    console.log("Countdown completed!");
  }
};

// Set interval to update countdown every second
const timer = setInterval(updateCountdown, 1000);
