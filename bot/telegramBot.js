require('dotenv').config({path:__dirname+'/.env'});
const { Telegraf } = require('telegraf');
const crypto = require('crypto');  // To generate a token
const botToken = process.env.BOT_TOKEN;
const appUrl = process.env.APP_URL;

if (!botToken) {
  console.error('Bot token is missing.');
  process.exit(1);
}

const bot = new Telegraf(botToken);

// Generate a random token for each user session
const generateToken = () => crypto.randomBytes(16).toString('hex');

bot.start(async (ctx) => {
  const user = ctx.from;
  const firstName = encodeURIComponent(ctx.from.first_name || 'Unknown');
  const lastName = encodeURIComponent(ctx.from.last_name || 'Unknown');
  const telegramID = ctx.from.id;
  const token = generateToken();

  try {
    const userAppUrl = `${appUrl}?telegramID=${telegramID}&fn=${firstName}&ln=${lastName}&token=${token}`;
    await ctx.reply(`Hello, ${firstName} ${lastName}. Click the "Go" button below to access the app:`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Go', web_app: { url: userAppUrl } }]
        ]
      }
    });
  } catch (error) {
    console.error('Error while processing the user:', error);
    await ctx.reply('An error occurred. Please try again later.');
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
