const prisma = require("../database/prisma");

function getKstDate() {
    return new Date(
        new Intl.DateTimeFormat("sv-SE", {
            timeZone: "Asia/Seoul"
        }).format(new Date())
    );
}

/**
 * 출석 체크
 */
async function checkAttendance(userId, userName) {
    const today = getKstDate();

    const exists = await prisma.attendance.findFirst({
        where: {
            user_id: userId,
            attendance_date: today
        }
    });

    if (exists) {
        return {
            already: true,
            message: "❗ 이미 오늘 출석했습니다."
        };
    }

    await prisma.userinfo.upsert({
        where: { user_id: userId },
        update: { user_name: userName },
        create: { user_id: userId, user_name: userName }
    });

    await prisma.attendance.create({
        data: {
            user_id: userId,
            attendance_date: today
        }
    });

    return {
        already: false,
        message: "✅ 출석 완료!"
    };
}

/**
 * 출석 현황 메시지 (cron용)
 */
async function sendAttendanceStatus(client) {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;

    const today = getKstDate();

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

    return channel.send(message);
}

module.exports = {
    checkAttendance,
    sendAttendanceStatus
};