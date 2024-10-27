const express = require('express');
const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');
const crypto = require('crypto');
require('dotenv').config({path:__dirname+'/.env'});
const cors = require('cors');


const botToken = process.env.BOT_TOKEN;
const appUrl = process.env.APP_URL;
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

if (!botToken) {
  console.error('Bot token is missing.');
  process.exit(1);
}

const bot = new Telegraf(botToken);
const userFilePath = path.join(__dirname, 'users.json');

// Generate a random token
const generateToken = () => crypto.randomBytes(16).toString('hex');

// Bot setup
bot.start(async (ctx) => {
  const user = ctx.from;
  const firstName = encodeURIComponent(ctx.from.first_name || 'Unknown');
  const lastName = encodeURIComponent(ctx.from.last_name || 'Unknown');
  const telegramID = ctx.from.id;
  const token = generateToken();

  try {
    const userAppUrl = `${appUrl}?telegramID=${telegramID}&fn=${firstName}&ln=${lastName}&token=${token}`;
    await ctx.reply(`Hello, ${firstName} ${lastName}. Click "Go" to access the app:`, {
      reply_markup: {
        inline_keyboard: [[{ text: 'Go', web_app: { url: userAppUrl } }]]
      }
    });
  } catch (error) {
    console.error('Error while processing the user:', error);
    await ctx.reply('An error occurred. Please try again later.');
  }
});

bot.launch();

// API Endpoint to save user data and start timers
const formatTime = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;
  return { days, hours, minutes, seconds: secs };
};

const readUserTime = () => {
  const data = fs.readFileSync(userFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write the admin data
const writeUserTime = (data) => {
  fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2), 'utf-8');
};


// Endpoint to save user data and start timers
app.post('/startTimer/:telegramID', (req, res) => {
  const { userName, telegramID } = req.body;
  console.log("Telegram ID: "+telegramID+"  UserNmae: "+userName);
  const initial45DayCountdown = 45 * 24 * 60 * 60;  // 45 days in seconds
  const initial8HourCountdown = 8 * 60 * 60;  // 8 hours in seconds

  // Load existing users
  let users = [];
  if (fs.existsSync(userFilePath)) {
    users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
  }

  // Check if user exists
  const existingUser = users.find(user => user.telegramID === telegramID);
  console.log(existingUser);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  // Add new user with formatted countdowns
  const newUser = {
    userName,
    telegramID,
    timestamp45Day: formatTime(initial45DayCountdown),
    timestamp8Hour: formatTime(initial8HourCountdown),
    claimStarted: false,
    claimPoint:0,
  };
  users.push(newUser);

  // Save updated users to JSON
  fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
  res.json({ message: 'User data saved successfully', user: newUser });
});

// Function to update countdowns
const updateTimers = () => {
  if (!fs.existsSync(userFilePath)) return;

  let users = readUserTime();
  users = users.map(user => {
    // Update 45-day timer
    let timestamp45DayInSeconds = 
      user.timestamp45Day.days * 24 * 60 * 60 +
      user.timestamp45Day.hours * 60 * 60 +
      user.timestamp45Day.minutes * 60 +
      user.timestamp45Day.seconds;

    if (timestamp45DayInSeconds > 0) {
      timestamp45DayInSeconds -= 1;
      user.timestamp45Day = formatTime(timestamp45DayInSeconds);
    }

    // Update 8-hour claim timer if started
    if (user.claimStarted) {
      let maxClaim = 50;

      if (user.claimPoint < maxClaim) {
        let inc = 50/(8*60*60);
        user.claimPoint+=inc;
      }
    }
    return user;
  });

  // Write updated users back to JSON file
  fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Update timers every second
setInterval(updateTimers, 1000);
// API to start the 8-hour claim timer
app.post('/startClaim', (req, res) => {
  const { telegramID } = req.body;
  try {
    const users = readUserTime();
    const user = users.find(a=> a.telegramID === telegramID);
    user.claimStarted = true;//!user.claimStarted;
    writeUserTime(users);
  } catch (error) {
    console.log(error);
  }  
});

app.post('/stopClaim', (req, res) => {
  const { telegramID } = req.body;
  try {
    const users = readUserTime();
    const user = users.find(a=> a.telegramID === telegramID);
    user.claimStarted = false;//!user.claimStarted;
    user.claimPoint = 0;
    writeUserTime(users);
  } catch (error) {
    console.log(error);
  }  
});



app.get('/liveFarmingPoints/:telegramID', (req,res) => {
  const {telegramID} = req.params;
  //console.log("TeleGramID: "+telegramID);
  try {
    const users = readUserTime();
    const user = users.find(a => a.telegramID === telegramID);
    if(user) {
      const newFP = user.claimPoint;
      const newFarmingStatus = user.claimStarted;
      res.status(200).json({newFP, newFarmingStatus});
    }
    else {
      res.status(500).json({message: "User Not Found"});
    }
  } catch (error) {
    console.log(error);
  }
})

app.get('/timeLeft/:telegramID', (req,res) => {
  const {telegramID} = req.params;
  try {
    const users = readUserTime();
    const user = users.find(a => a.telegramID === telegramID);
    if(user) {
      res.status(200).json(user.timestamp45Day);
    }
    else {
      res.status(500).json({message: "User Not Found"});
    }
  } catch (error) {
    console.log(error);
  }
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
