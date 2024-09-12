import TelegramBot from 'node-telegram-bot-api';

// Replace with real token bot
const token = '';

const bot = new TelegramBot(token, { polling: false});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hi, please select the tube lines you are interested in');
});

// Confirm that the input has been received
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text
    bot.sendMessage(chatId, `Got it, you are interested in ${msg.text} line`);
    
});

