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

const admin = require("firebase-admin");

const serviceAccount = require("./tarbo-coin-firebase-adminsdk-4zphx-0bfd9de34d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tarbo-coin-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();


if (!botToken) {
  console.error('Bot token is missing.');
  process.exit(1);
}
else{
  console.log("Bot Token: "+botToken);
}

const bot = new Telegraf(botToken);

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
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



// Firebase Function

const cookieParser = require('cookie-parser'); // Ensure you have cookie-parser installed
app.use(cookieParser());

app.get('/initialize-user/:telegramId/:userName', async (req, res) => {
  const telegramId = req.params.telegramId;
  const userName = req.params.userName;
  console.log("Username: "+userName);
  const userRef = db.ref(`UserDb/${telegramId}`);

  try {
    const snapshot = await userRef.once('value');
    const date = new Date();
    if (!snapshot.exists()) {
      const response = await userRef.set({
        name: userName,
        balance: 0,
        coin: 0,
        level: 1,
        levelPoints: 0,
        isFarming: false,
        telegramId: telegramId,
        farmingPoint: 0,
        maxPoints:200,
        checkIn: {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          collect: false,
        },
        levelReward: [false],
        continueDay: 1,
      });
      console.log("Response: "+response);
    }
    else{
      Console.log("Else Fire>>>");
    }

    // Set the Telegram ID as a cookie for client-side use
    res.cookie('authToken', telegramId, { httpOnly: true });
    res.send('User initialized');
  } catch (error) {
    res.status(500).send('Error initializing user');
  }
});

const farmingInterval = 1000; // 1 second

setInterval(async () => {
  const userDbRef = admin.database().ref('UserDb');
  const snapshot = await userDbRef.orderByChild('isFarming').equalTo(true).once('value');

  snapshot.forEach(async (childSnapshot) => {
    const userData = childSnapshot.val();
    if (userData.farmingPoint  < 10) {
      await childSnapshot.ref.update({
        farmingPoint: userData.farmingPoint + 2
      });
    } else {
      await childSnapshot.ref.update({
        isFarming: false
      });
    }
  });
}, farmingInterval);

app.post('/start-farming', async (req, res) => {
  try {
    console.log('Request Here..');
    const {telegramID} = req.body;
    const userRef = db.ref(`UserDb/${telegramID}`);
    const snapshot = await userRef.once('value');
    // if(!snapshot) {
    //   return res.status(404).json("User Not Exists");
    // }
    const userData = snapshot.val();
    await userRef.update({
      isFarming: true
    });
    console.log(userData);
  } catch (error) {
    console.log(error);
  }
})
app.post('/points-claim', async(req, res) => {
  try {
    const {telegramID, points} = req.body;
    const userRef = db.ref(`UserDb/${telegramID}`);
    const snapshot = await userRef.once('value');
    console.log()
    if(!snapshot) {
      return res.json("User Not Exists");
    }
    const userData = snapshot.val();
    if(userData.levelPoints+points>userData.maxPoints) {
      const levelReward = userData.levelReward;
      await userRef.update({
        coin: userData.coin+points,
        levelPoints: userData.levelPoints+points-userData.maxPoints,
        level: userData.level+1,
        farmingPoint: 0,
        maxPoints: userData.maxPoints+(userData.level)*20,
        levelReward: [...levelReward, false],     
       });
    }
    else{
      await userRef.update({
        coin: userData.coin+points,
        levelPoints: userData.levelPoints+points,
        farmingPoint: 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
})

app.post('/checkIn', async (req, res) => {
  try {
    const { telegramID } = req.body;
    const userRef = db.ref(`UserDb/${telegramID}`);
    const snapshot = await userRef.once('value');
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userDate = userData.checkIn;
      const date = new Date();
      const newCheckIn = {
        day: date.getDate(),  // get the actual day of the month
        month: date.getMonth(),  // get the current month
        year: date.getFullYear(),  // get the full year
        collect: false
      };

      // Compare current date to user's last check-in date
      if ((date.getDate() - userDate.day === 1 && date.getMonth() === userDate.month && date.getFullYear() === userDate.year)) {
        await userRef.update({
          continueDay: userData.continueDay + 1,  // use userData.continueDay instead of day
          checkIn: newCheckIn,
        });
      } else if(date.getDate() !== userDate.day) {
        await userRef.update({
          continueDay: 1,
          checkIn: newCheckIn,
        });
      }

      return res.json("Check-in updated successfully.");
    } else {
      return res.json("User not found.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
});


app.post('/dailyReward-claim', async(req, res) => {
  try {
    const {telegramID} = req.body;
    const userRef = db.ref(`UserDb/${telegramID}`);
    const snapshot = await userRef.once('value');
    const checkInRef = db.ref(`UserDb/${telegramID}/checkIn`);
    if(!snapshot) {
      return res.json("User Not Exists");
    }
    const userData = snapshot.val();
    const points = 20+(userData.continueDay-1)*10;
    if(!userData.checkIn.collect){
      const levelReward = userData.levelReward
      if(userData.levelPoints+points>userData.maxPoints) {
        await userRef.update({
          coin: userData.coin+points,
          levelPoints: userData.levelPoints+points-userData.maxPoints,
          level: userData.level+1,
          maxPoints: userData.maxPoints+(userData.level)*20,
          levelReward: [...levelReward, false],
        },);
      }
      else{
        await userRef.update({
          coin: userData.coin+points,
          levelPoints: userData.levelPoints+points,
        });
      }
      await checkInRef.update({collect:true});
    }
  } catch (error) {
    console.log(error);
  }
})


app.post('/levelReward-claim', async (req, res) => {
  try {
    const {idx, telegramID} = req.body;
    const val = (idx+1)*0.01;
    const userRef = db.ref(`UserDb/${telegramID}`);
    const snapshot = await userRef.once('value');
  if(snapshot.exists()){
    const userData = snapshot.val();
    const levelReward = userData.levelReward;
    levelReward[idx] = true;
    await userRef.update({
      balance: userData.balance+val,
      levelReward,
    })
  }
  else{
    console.log("User Not Found");
  }
  
  } catch (error) {
    console.log(error);
  }
})























// API Endpoint to save user data and start timers
const formatTime = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;
  return { days, hours, minutes, seconds: secs };
};


// Endpoint to save user data and start timers



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
