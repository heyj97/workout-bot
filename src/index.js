require("dotenv").config();
const prisma = require("./database/prisma");
const { Client, GatewayIntentBits } = require("discord.js");

const interactionCreate = require("./events/interactionCreate");
const { startAttendanceJob } = require("./jobs/attendanceCron");
const { startWatchdog } = require("./system/watchdog");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", async () => {
    console.log(`${client.user.tag} 로그인`);

    // DB 체크
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Railway DB 연결 성공");
    } catch (err) {
        console.error("❌ DB 연결 실패", err);
    }

    // cron + watchdog
    startAttendanceJob(client);
    startWatchdog();

    console.log("🤖 Bot ready");
});

client.on("interactionCreate", interactionCreate);

client.login(process.env.DISCORD_TOKEN);