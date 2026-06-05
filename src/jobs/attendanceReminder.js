const cron = require("node-cron");
const prisma = require("../database/prisma");

function getChannel(client) {
    return client.channels.cache.get(process.env.CHANNEL_ID);
}

async function sendAttendanceStatus(client) {
    const channel = getChannel(client);
    if (!channel) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await prisma.userinfo.findMany();
    const attendance = await prisma.attendance.findMany({
        where: { attendance_date: today }
    });

    const attendedSet = new Set(attendance.map(a => a.user_id));

    let message = "🏋️ 오늘 출석 현황\n\n";

    users.forEach(user => {
        const status = attendedSet.has(user.user_id) ? "✅" : "❌";
        message += `${user.user_name} ${status}\n`;
    });
    
    message += "\n\n출석하지 않은 회원님들은 빨리 운동하쇼;";

    channel.send(message);
}

function startAttendanceJob(client) {
    const schedules = [15, 18, 21]; // 15시, 18시, 21시에 알림을 울림.

    schedules.forEach(hour => {
        cron.schedule(`0 ${hour} * * *`, async () => {
            console.log(`⏰ ${hour}:00 출석현황 알림 실행`);
            await sendAttendanceStatus(client);
        }, {
            timezone: "Asia/Seoul"
        });
    });
    console.log("⏰ cron job 등록 완료 (15:00 / 18:00 / 21:00)");
}

module.exports = { startAttendanceJob };