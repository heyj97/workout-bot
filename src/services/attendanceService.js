const prisma = require("../database/prisma");

function getKstDate() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    kst.setHours(0, 0, 0, 0);
    return new Date(kst.getTime() - 9 * 60 * 60 * 1000);
}

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

module.exports = { checkAttendance };