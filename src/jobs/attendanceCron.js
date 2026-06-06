const cron = require("node-cron");
const { sendAttendanceStatus } = require("../services/attendanceStatusService");
const { registerJob } = require("../system/cronManager");

function startAttendanceJob(client) {
    // 기존 시간별
    const hourlySchedules = [15, 18, 21, 23];

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

    console.log("✅ attendance cron 등록 완료");
}

module.exports = { startAttendanceJob };