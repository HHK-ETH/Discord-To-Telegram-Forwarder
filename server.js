import * as dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';
import { Events } from 'discord.js';

// import env variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_CHANNEL_IDS = process.env.DISCORD_CHANNEL_IDS.split(';');
const DISCORD_FORWARD_BOT = process.env.DISCORD_FORWARD_BOT === 'true';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const MSG_FILTER = process.env.MSG_FILTER.split(';');

console.log('Telegram bot token: ' + TELEGRAM_BOT_TOKEN);
console.log('Telegram chat id: ' + TELEGRAM_CHAT_ID);
console.log('Discord token: ' + DISCORD_TOKEN);
console.log('Discord channel ids: ' + DISCORD_CHANNEL_IDS);

const telegram = new TelegramBot(TELEGRAM_BOT_TOKEN);

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

discordClient.login(DISCORD_TOKEN);

discordClient.once(Events.ClientReady, () => {
  console.log('Discord bot ready!');

  // Discord -> Telegram handler
  discordClient.on(Events.MessageCreate, async (message) => {
    // Ignore messages from bots if DISCORD_FORWARD_BOT is 'false'
    if (DISCORD_CHANNEL_IDS.indexOf(message.channel.id) === -1 || (message.author.bot && !DISCORD_FORWARD_BOT)) {
      return;
    }

    // Apply filter
    for (let msg of MSG_FILTER) {
      if (message.content.indexOf(msg) !== -1) {
        return;
      }
    }

    let text = '';
    if (message.content.indexOf('[Tweeted]') === 0 || message.content.indexOf('[Retweeted]') === 0) {
      text = parseTweetLink(message.content.toLowerCase());
    } else {
      text = parseMessage(message);
    }

    let isForwarded = false;
    while (!isForwarded) {
      try {
        const tgMsg = await telegram.sendMessage(TELEGRAM_CHAT_ID, text);
        if (tgMsg.message_id) isForwarded = true;
      } catch (err) {
        console.log(err);
      }
    }
  });
});

function parseTweetLink(message) {
  message = message.replaceAll('[', '');
  message = message.replaceAll(']', ': ');
  message = message.replaceAll('(', '');
  message = message.replaceAll(')', '');

  return message;
}

function parseMessage(message) {
  const mentioned_usernames = [];
  for (let mention of message.mentions.users) {
    mentioned_usernames.push('@' + mention[1].username);
  }
  const attachmentUrls = [];
  for (let attachment of message.attachments) {
    attachmentUrls.push(attachment[1].url);
  }

  // remove tags
  let finalMessageContent = message.content.replace(/<@.*>/gi, '');
  // convert bold text for telegram markdown
  finalMessageContent = finalMessageContent.replace(/\*\*/g, '*');

  return finalMessageContent + ` ${attachmentUrls.join(' ')}` + mentioned_usernames.join(' ');
}
