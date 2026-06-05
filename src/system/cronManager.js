const jobs = [];

/**
 * cron 등록 + 이름 저장
 */
function registerJob(job, name) {
    jobs.push({
        job,
        name,
        lastRun: null
    });

    console.log(`🟢 cron 등록됨: ${name}`);
}

/**
 * watchdog이 사용할 데이터
 */
function getJobs() {
    return jobs;
}

module.exports = {
    registerJob,
    getJobs
};