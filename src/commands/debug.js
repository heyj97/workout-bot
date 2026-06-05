const prisma = require("../database/prisma");

// 외부에서 주입되는 상태
let commandReport = {
    valid: [],
    invalid: []
};

// setter
function setCommandReport(report) {
    commandReport = report;
}

async function execute(interaction) {
    // 관리자 체크
    if (!interaction.memberPermissions?.has("Administrator")) {
        return interaction.reply({
            content: "❌ 관리자만 사용할 수 있습니다.",
            flags: 64
        });
    }

    // DB 체크
    let dbStatus = "❌ 실패";

    try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = "✅ 정상";
    } catch {
        dbStatus = "❌ 실패";
    }

    // ping
    const latency = interaction.client.ws.ping;

    let message = "🛠 **BOT DEBUG INFO**\n\n";

    message += `📡 DB 상태: ${dbStatus}\n`;
    message += `📶 Ping: ${latency}ms\n\n`;

    message += `📦 Commands Loaded: ${commandReport.valid.length}\n`;
    message += `❌ Invalid Commands: ${commandReport.invalid.length}\n\n`;

    message += `✔ Valid:\n`;
    commandReport.valid.forEach((c, i) => {
        message += `${i + 1}. ${c}\n`;
    });

    if (commandReport.invalid.length > 0) {
        message += `\n❌ Invalid:\n`;
        commandReport.invalid.forEach((c, i) => {
            message += `${i + 1}. ${c.file} (${c.reason})\n`;
        });
    }

    return interaction.reply({
        content: message,
        flags: 64
    });
}

module.exports = {
    name: "debug",
    execute,
    setCommandReport
};