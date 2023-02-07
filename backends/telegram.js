import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

console.log("Telegram bot token: " + TELEGRAM_BOT_TOKEN);

export var telegram = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});
