require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const interactionCreate = require("./events/interactionCreate");
const { startAttendanceJob } = require("./jobs/attendanceCron");
const { startWatchdog } = require("./system/watchdog");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", async () => {
    console.log(`${client.user.tag} 로그인`);

    // cron + watchdog
    startAttendanceJob(client);
    startWatchdog();

    console.log("🤖 Bot ready");
});

client.on("interactionCreate", interactionCreate);

client.login(process.env.DISCORD_TOKEN);