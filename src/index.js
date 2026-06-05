require("dotenv").config();
const prisma = require("./database/prisma");
const { Client, GatewayIntentBits } = require("discord.js");

const interactionCreate = require("./events/interactionCreate");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", async () => {
    console.log(`${client.user.tag} 로그인`);

    const users = await prisma.userinfo.findMany();

    console.log(users);
});

client.on("interactionCreate", interactionCreate);

client.login(process.env.DISCORD_TOKEN);