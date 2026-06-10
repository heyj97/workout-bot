const cron = require("node-cron");
const { registerJob } = require("../system/cronManager");
const API_HEADERS = require("../constants/APIHeader");

async function attendanceStatus(client) {
    const BASE_URL =
        process.env.NODE_ENV === "production"
            ? process.env.PRODUCTION_URL
            : process.env.DEVELOP_URL;

    try {
        // 1. 전체 유저 조회
        const userRes = await fetch(`${BASE_URL}/users`, {
            headers: API_HEADERS
        });

        if (!userRes.ok) {
            throw new Error(`users fetch failed: ${userRes.status}`);
        }

        const userJson = await userRes.json();

        if (!userJson.isSuccess) {
            throw new Error(userJson.message);
        }

        const users = userJson.data;

        // 2. 유저별 출석 체크
        const results = await Promise.all(
            users.map(async (user) => {
                try {
                    const checkRes = await fetch(
                        `${BASE_URL}/attendance/check/${user.user_discord_id}`,
                        {
                            headers: API_HEADERS
                        }
                    );

                    // 404 = 결석
                    if (checkRes.status === 404) {
                        return `${user.user_name} 결석`;
                    }

                    if (!checkRes.ok) {
                        return `${user.user_name} ❌ 오류`;
                    }

                    const checkJson = await checkRes.json();

                    if (checkJson.isSuccess) {
                        return `${user.user_name} 출석`;
                    }

                    return `${user.user_name} 결석`;

                } catch (err) {
                    console.error(err);
                    return `${user.user_name} ❌ 오류`;
                }
            })
        );

        // 3. 메시지 생성
        const message = results
            .map((text, index) => `${index + 1}. ${text}`)
            .join("\n");

        const finalMessage = [
            "📢 출석 현황 체크",
            "",
            message
        ].join("\n");

        console.log(finalMessage);

        // 4. 디스코드 채널 전송
        const channelId = process.env.ATTENDANCE_CHANNEL_ID;

        if (!channelId) {
            throw new Error("ATTENDANCE_CHANNEL_ID가 설정되지 않았습니다.");
        }

        const channel = await client.channels.fetch(channelId);

        if (!channel) {
            throw new Error("출석 알림 채널을 찾을 수 없습니다.");
        }

        await channel.send(finalMessage);

    } catch (err) {
        console.error("❌ attendanceStatus 실패", err);
    }
}

function startAttendanceJob(client) {
    const hourlySchedules = [15, 18, 21, 23];

    hourlySchedules.forEach(hour => {
        const job = cron.schedule(
            `0 ${hour} * * *`,
            async () => {
                try {
                    console.log(`⏰ 출석 cron 실행: ${hour}:00`);
                    await attendanceStatus(client);
                } catch (err) {
                    console.error(`❌ cron 실패 (${hour}:00)`, err);
                }
            },
            {
                timezone: "Asia/Seoul"
            }
        );

        registerJob(job, `attendance-${hour}`);
    });

    console.log("✅ attendance cron 등록 완료");
}

module.exports = { startAttendanceJob };