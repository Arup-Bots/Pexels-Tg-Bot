const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Load environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PIXELS_API_KEY = process.env.PIXELS_API_KEY;

// Replace YOUR_TOKEN with your Telegram bot token
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Pixels API endpoint
const pixelsEndpoint = 'https://api.pexels.com/v1/search';

// Handler function for incoming messages
bot.on('message', async (msg) => {
  // Check if the message contains text
  if (msg.text) {
    try {
      // Make a request to the Pixels API to get images based on the user's keyword
      const response = await axios.get(pixelsEndpoint, {
        headers: {
          Authorization: PIXELS_API_KEY,
        },
        params: {
          query: msg.text,
          per_page: 10, // Get up to 10 images
        },
      });

      // Get a random image URL from the response
      const images = response.data.photos.map((photo) => photo.src.medium);
      const imageUrl = images[Math.floor(Math.random() * images.length)];

      // Send the image to the user
      bot.sendPhoto(msg.chat.id, imageUrl);
    } catch (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'An error occurred. Please try again later.');
    }
  }
});

// Listen for the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'Welcome to the Image Bot! Please enter a keyword to search for images.And Please DO Join Our Bot Channel @arupbots Enjoy😃 ';
  bot.sendMessage(chatId, message);
});
