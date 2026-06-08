let commandReport = {
    valid: [],
    invalid: []
};

function setCommandReport(report) {
    commandReport = report;
}

async function execute(interaction) {
    if (!interaction.memberPermissions?.has("Administrator")) {
        return interaction.reply({
            content: "❌ 관리자만 사용할 수 있습니다.",
            flags: 64
        });
    }

    const BASE_URL =
        process.env.NODE_ENV === "production"
            ? process.env.PRODUCTION_URL
            : process.env.DEVELOP_URL;

    // -----------------------------
    // 1. Backend health check
    // -----------------------------
    let backendStatus = "❌ 실패";

    try {
        const res = await fetch(`${BASE_URL}/users`);

        if (res.ok) {
            const { isSuccess } = await res.json();
            backendStatus = isSuccess ? "✅ 정상" : "❌ 비정상";
        }
    } catch {
        backendStatus = "❌ 실패";
    }

    // -----------------------------
    // 2. Bot latency
    // -----------------------------
    const latency = interaction.client.ws.ping;

    // -----------------------------
    // 3. message build
    // -----------------------------
    let message = "🛠 **BOT DEBUG INFO**\n\n";

    message += `🤖 Bot Ping: ${latency}ms\n`;
    message += `🌐 Backend: ${backendStatus}\n\n`;

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