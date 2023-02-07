# Discord-To-Telegram-Forwarder
Initially forked from Rikj000/Discord-Telegram-Bridge

`Discord` -> `Telegram` forwarder

#### Setup:
* Clone the GitHub repo.
* Execute `npm install`.
* Set env variables:
    - `TELEGRAM_BOT_TOKEN` - you can get this by speaking with @BotFather on telegram and creating a new bot.
    - `DISCORD_TOKEN` - the bot token for your Discord application. Create a new app at the [Discord Developer Portal](https://discord.com/developers/applications), go to the bot section, click on Create a bot and copy the bot token it gives to you.
    - `TELEGRAM_CHAT_ID` - The chat ID of the telegram group you want to bridge (even if public, don't use the chat's username).
    - `DISCORD_CHANNEL_IDS` - The Discord ChannelId of the channels you want to bridge with a space between them.
    - If you need to forward Discord Bot messages -> Telegram set `DISCORD_FORWARD_BOT` to `true`  (will cause duplicate messages in bridges that forward in both directions).

* Run `npm start` or `node server.js` and you're set!
