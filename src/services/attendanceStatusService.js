const prisma = require("../database/prisma");

function getKstDate() {
    return new Date(
        new Intl.DateTimeFormat("sv-SE", {
            timeZone: "Asia/Seoul"
        }).format(new Date())
    );
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

    const formattedTime = new Date(record.attended_at).toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit"
    });

    return {
        attended: true,
        message: `✅ 오늘 출석 완료\n⏰ 출석 시간: ${formattedTime}`
    };
}

module.exports = { getTodayStatus };