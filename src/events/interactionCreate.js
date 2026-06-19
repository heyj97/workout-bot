const fs = require("fs");
const path = require("path");

// 1. commands 자동 로딩
const commands = {};

const validCommands = [];
const invalidCommands = [];

// 🔥 debug용 공유 데이터
const commandReport = {
    valid: [],
    invalid: []
};

// commands 폴더 경로
const commandsPath = path.join(__dirname, "../commands");

// 파일 읽기
const commandFiles = fs.readdirSync(commandsPath);

// 로딩
for (const file of commandFiles) {
    if (!file.endsWith(".js")) continue;

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // 2. validation
    if (!command || typeof command !== "object") {
        invalidCommands.push({ file, reason: "invalid export" });
        commandReport.invalid.push({ file, reason: "invalid export" });
        continue;
    }

    if (!command.name || typeof command.name !== "string") {
        invalidCommands.push({ file, reason: "missing name" });
        commandReport.invalid.push({ file, reason: "missing name" });
        continue;
    }

    if (!command.execute || typeof command.execute !== "function") {
        invalidCommands.push({ file, reason: "missing execute" });
        commandReport.invalid.push({ file, reason: "missing execute" });
        continue;
    }

    // 중복 체크
    if (commands[command.name]) {
        invalidCommands.push({ file, reason: "duplicate name" });
        commandReport.invalid.push({ file, reason: "duplicate name" });
        continue;
    }

    // 3. 등록
    commands[command.name] = command;

    validCommands.push(command.name);
    commandReport.valid.push(command.name);
}

// ===== 로딩 결과 출력 =====
console.log("\n========== COMMAND LOADING RESULT ==========");

console.log(`✔ VALID COMMANDS (${validCommands.length})`);
validCommands.forEach((name, i) => {
    console.log(`  ${i + 1}. ${name}`);
});

console.log(`\n❌ INVALID COMMANDS (${invalidCommands.length})`);
invalidCommands.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.file} → ${item.reason}`);
});

console.log("===========================================\n");

// 🔥 debug 연동 (핵심)
const debugCommand = require("../commands/debug");
debugCommand.setCommandReport(commandReport);

// 4. interaction handler
module.exports = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;

    console.log(`[CMD] ${commandName}`);

    const command = commands[commandName];

    if (!command) {
        console.warn(`[NOT FOUND] ${commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`[ERROR] ${commandName}`, error);

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    content: "⚠️ 명령어 실행 중 오류 발생",
                    embeds: []
                });
            } else {
                await interaction.reply({
                    content: "⚠️ 명령어 실행 중 오류 발생",
                    flags: 64
                });
            }
        } catch (replyError) {
            console.error(`[ERROR RESPONSE FAILED] ${commandName}`, replyError);
        }
    }
};

// export (debug에서도 사용 가능)
module.exports.commandReport = commandReport;
