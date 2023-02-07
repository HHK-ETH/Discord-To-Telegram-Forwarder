#!/usr/bin/env node
import { discordClient } from './backends/discord.js';
import { telegram } from './backends/telegram.js';

// import env variables
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_CHANNEL_IDS = process.env.DISCORD_CHANNEL_IDS.split(" ");
const DISCORD_FORWARD_BOT = (process.env.DISCORD_FORWARD_BOT === 'true')

console.log("Telegram chat id: " + TELEGRAM_CHAT_ID);
console.log("Discord channel ids: " + DISCORD_CHANNEL_IDS);

// Discord -> Telegram handler
discordClient.on("message", message => {

	// the program currently check if the message's from a bot to check for duplicates.
	// This isn't the best method but it's good enough.
	// A webhook counts as a bot in the discord api, don't ask me why.
	// Ignore messages from bots if DISCORD_FORWARD_BOT is 'false'
	if (DISCORD_CHANNEL_IDS.indexOf(message.channel.id) !== -1 || (message.author.bot && !DISCORD_FORWARD_BOT)) {
		return;
	}

	let mentioned_usernames = []
	for (let mention of message.mentions.users) {
		mentioned_usernames.push("@" + mention[1].username);
	}
	var attachmentUrls = []
	for (let attachment of message.attachments) {
		attachmentUrls.push(attachment[1].url);
	}

	// attachmentUrls is empty when there are no attachments so we can be just lazy
	var finalMessageContent = message.content.replace(/<@.*>/gi, '');
	// convert bold text for telegram markdown
	finalMessageContent = finalMessageContent.replace(/\*\*/g, '*');

	var text = `*\[DISCORD\] ${message.author.username} (${message.author.username}#${message.author.discriminator}):*\n`;
	text += finalMessageContent
	text += ` ${attachmentUrls.join(' ')}`;
	text += mentioned_usernames.join(" ");

	try {
		telegram.sendMessage(TELEGRAM_CHAT_ID, text, {parse_mode: 'markdown'});
	}
	catch(err) {
		console.log(err.message);
		return;
	}
});