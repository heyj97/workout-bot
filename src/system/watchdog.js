const { getJobs } = require("./cronManager");

function startWatchdog() {
    setInterval(() => {
        console.log("💓 watchdog check...");

        const jobs = getJobs();

        jobs.forEach(({ job, name }) => {
            if (!job.running) {
                console.log(`🔁 cron 재시작: ${name}`);
                try {
                    job.start();
                } catch (err) {
                    console.error(`❌ cron 재시작 실패: ${name}`, err);
                }
            }
        });
    }, 5 * 60 * 1000); // 5분마다 체크

    console.log("✅ watchdog 시작됨");
}

module.exports = { startWatchdog };