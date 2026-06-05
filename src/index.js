require("dotenv").config();
const prisma = require("./database/prisma");
const { Client, GatewayIntentBits } = require("discord.js");

const interactionCreate = require("./events/interactionCreate");
const {startAttendanceJob} = require("./jobs/attendanceReminder");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", async () => {
    // 1. Discord Bot 로그인
    console.log(`${client.user.tag} 로그인`);
    
    // 2. DB 연결 테스트
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Railway DB 연결 성공");
    } catch (err) {
        console.error("❌ DB 연결 실패", err);
    }

    // 3. cron job 시작(운동알리미)
    startAttendanceJob(client);
    
    // 4. 봇이 준비되었음을 알림
    console.log("🤖 개트 Bot이 준비되었습니다.");
});

client.on("interactionCreate", interactionCreate);

client.login(process.env.DISCORD_TOKEN);