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

const serviceAccountPth = process.env.GOOGLE_APPLICATION_CREDENTIALS;



if (!admin.apps.length) {
  // Replace with the path to your service account file
  const serviceAccount = require('./tarbo-coin-83350-firebase-adminsdk-mlcsu-ec29790969.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tarbo-coin-83350-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });

  console.log("Firebase initialized.");
} else {
  console.log("Firebase is already initialized.");
}

setInterval(async () => {
  try {
    // Your logic here
    console.log("Running scheduled task...");
    // Example: Refresh Firebase credentials or perform other operations
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
}, 60 * 60 * 1000);




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

//Bot setup
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
  console.log("User Data Initilize");
  const telegramId = req.params.telegramId;
  const userName = req.params.userName;
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
        timeLeft: 50*24*60*60,
      });
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
  
  try {
    const snapshot = await userDbRef.orderByChild('isFarming').equalTo(true).once('value');

    // Create an array of promises to update all users concurrently
    const updates = [];

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();

      if (userData.farmingPoint < 1000) {
        // Prepare the update operation to increase farmingPoint by 2
        updates.push(
          childSnapshot.ref.update({
            farmingPoint: userData.farmingPoint + 2,
          })
        );
      } else {
        // Prepare the update operation to set isFarming to false
        updates.push(
          childSnapshot.ref.update({
            isFarming: false,
          })
        );
      }
    });

    // Wait for all updates to complete
    await Promise.all(updates);

  } catch (error) {
    console.error("Error updating farming points:", error);
  }

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

const updateUserTimeLeft = async () => {
  const userDbRef = db.ref('UserDb');
  
  try {
    // Retrieve all users with a single query
    const snapshot = await userDbRef.once('value');

    const updates = {};

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      if (userData.timeLeft && userData.timeLeft > 0) {
        // Add the decrement operation to the batch
        updates[`${childSnapshot.key}/timeLeft`] = userData.timeLeft - 1;
      }
    });

    // Perform the batch update in one go
    await userDbRef.update(updates);

  } catch (error) {
    console.error('Error updating timeLeft:', error);
  }
};

// Set the interval to call this function every minute to reduce load
setInterval(updateUserTimeLeft, 1000); 






















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
