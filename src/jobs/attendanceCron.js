const cron = require("node-cron");
const { sendAttendanceStatus } = require("../services/attendanceService");
const { registerJob } = require("../system/cronManager");

function startAttendanceJob(client) {
    const schedules = [15, 18, 19, 21];

    schedules.forEach(hour => {
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

    console.log("✅ attendance cron 등록 완료");
}

module.exports = { startAttendanceJob };