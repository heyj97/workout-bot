const prisma = require("../database/prisma");

/**
 * 이번 달 출석 랭킹
 */
async function checkAttendanceRanking() {
    const now = new Date();

    // 이번 달 1일
    const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    // 다음 달 1일
    const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
    );

    // 이번 달 출석 횟수 집계
    const ranking = await prisma.attendance.groupBy({
        by: ["user_id"],
        where: {
            attendance_date: {
                gte: startDate,
                lt: endDate
            }
        },
        _count: {
            user_id: true
        },
        orderBy: {
            _count: {
                user_id: "desc"
            }
        }
    });

    if (ranking.length === 0) {
        return "📋 이번 달 출석 기록이 없습니다.";
    }

    // 유저 정보 조회
    const userIds = ranking.map(r => r.user_id);

    const users = await prisma.userinfo.findMany({
        where: {
            user_id: {
                in: userIds
            }
        }
    });

    const userMap = new Map(
        users.map(user => [user.user_id, user.user_name])
    );

    let message = "🏆 이번 달 출석 랭킹\n\n";

    ranking.forEach((user, index) => {
        const medal =
            index === 0 ? "🥇" :
                index === 1 ? "🥈" :
                    index === 2 ? "🥉" : "🏅";

        message += `${medal} ${index + 1}위 ${userMap.get(user.user_id) || user.user_id} - ${user._count.user_id}회\n`;
    });

    return message;
}

module.exports = {
    checkAttendanceRanking
};