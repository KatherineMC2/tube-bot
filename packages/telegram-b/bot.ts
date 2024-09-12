import TelegramBot from 'node-telegram-bot-api';

// Replace with real token bot
const token = '';

const bot = new TelegramBot(token, { polling: false});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '¡Hola! Soy un bot hecho con TypeScript.');
});

// Responder a cualquier mensaje de texto
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text
    bot.sendMessage(chatId, `Recibí tu mensaje: ${msg.text}`);
    
});

