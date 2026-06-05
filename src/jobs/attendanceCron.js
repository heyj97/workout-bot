const cron = require("node-cron");
const { sendAttendanceStatus } = require("../services/attendanceService");
const { registerJob } = require("../system/cronManager");

function startAttendanceJob(client) {
    // 기존 시간별
    const hourlySchedules = [15, 18, 21];

    hourlySchedules.forEach(hour => {
        const job = cron.schedule(
            `0 ${hour} * * *`,
            async () => {
                try {
                    console.log(`⏰ 출석 cron 실행: ${hour}:00`);
                    await sendAttendanceStatus(client);
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

    // 🔥 테스트용 19:10
    const testJob = cron.schedule(
        `10 19 * * *`,
        async () => {
            try {
                console.log("⏰ 테스트 cron 실행: 19:10");
                await sendAttendanceStatus(client);
            } catch (err) {
                console.error("❌ 테스트 cron 실패 (19:10)", err);
            }
        },
        {
            timezone: "Asia/Seoul"
        }
    );

    registerJob(testJob, "attendance-test-19-10");

    console.log("✅ attendance cron 등록 완료");
}

module.exports = { startAttendanceJob };