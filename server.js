import * as dotenv from 'dotenv'
dotenv.config()
import { Client, Intents } from "discord.js";
import TelegramBot from "node-telegram-bot-api";

// import env variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_CHANNEL_IDS = process.env.DISCORD_CHANNEL_IDS.split(";");
const DISCORD_FORWARD_BOT = (process.env.DISCORD_FORWARD_BOT === 'true')
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const MSG_FILTER = process.env.MSG_FILTER.split(";");

console.log("Telegram bot token: " + TELEGRAM_BOT_TOKEN);
console.log("Telegram chat id: " + TELEGRAM_CHAT_ID);
console.log("Discord token: " + DISCORD_TOKEN);
console.log("Discord channel ids: " + DISCORD_CHANNEL_IDS);

const telegram = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

discordClient.login(DISCORD_TOKEN);

discordClient.once("ready", () => {
	console.log("Discord bot ready!");

	// Discord -> Telegram handler
	discordClient.on("message", message => {

		// the program currently check if the message's from a bot to check for duplicates.
		// This isn't the best method but it's good enough.
		// A webhook counts as a bot in the discord api, don't ask me why.
		// Ignore messages from bots if DISCORD_FORWARD_BOT is 'false'
		if (DISCORD_CHANNEL_IDS.indexOf(message.channel.id) === -1 || (message.author.bot && !DISCORD_FORWARD_BOT)) {
			return;
		}

		// Apply filter
		for (let msg of MSG_FILTER) {
			if (message.indexOf(msg) !== -1) {
				return; 
			}
		}

		const mentioned_usernames = [];
		for (let mention of message.mentions.users) {
			mentioned_usernames.push("@" + mention[1].username);
		}
		const attachmentUrls = [];
		for (let attachment of message.attachments) {
			attachmentUrls.push(attachment[1].url);
		}

		// attachmentUrls is empty when there are no attachments so we can be just lazy
		let finalMessageContent = message.content.replace(/<@.*>/gi, '');
		// convert bold text for telegram markdown
		finalMessageContent = finalMessageContent.replace(/\*\*/g, '*');

		let text = finalMessageContent + ` ${attachmentUrls.join(' ')}` + mentioned_usernames.join(" ");

		try {
			telegram.sendMessage(TELEGRAM_CHAT_ID, text, {parse_mode: 'markdown'});
		}
		catch(err) {
			console.log(err.message);
			return;
		}
	});
});