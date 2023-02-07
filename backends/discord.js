import { Client, Intents, WebhookClient } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

console.log("Discord token: " + DISCORD_TOKEN);

export const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

discordClient.once("ready", () => {
	console.log("Discord bot ready!");
});

discordClient.login(DISCORD_TOKEN);
