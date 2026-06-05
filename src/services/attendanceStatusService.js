const prisma = require("../database/prisma");

function getKstDate() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    kst.setHours(0, 0, 0, 0);
    return new Date(kst.getTime() - 9 * 60 * 60 * 1000);
}

async function getTodayStatus(userId, userName) {
    const today = getKstDate();

    const record = await prisma.attendance.findFirst({
        where: {
            user_id: userId,
            attendance_date: today
        }
    });

    if (!record) {
        return {
            attended: false,
            message: "❌ 오늘 아직 출석하지 않았습니다."
        };
    }

    const formattedTime = new Date(record.attended_at).toLocaleString("ko-KR");

    return {
        attended: true,
        message: `✅ 오늘 출석 완료\n⏰ 출석 시간: ${formattedTime}`
    };
}

module.exports = { getTodayStatus };