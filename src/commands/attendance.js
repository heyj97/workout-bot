const { checkAttendance } = require("../services/attendanceService");

module.exports = {
    name: "출석",

    async execute(interaction) {
        const userId = interaction.user.id;
        const userName = interaction.user.username;

        try {
            const result = await checkAttendance(userId, userName);

            return interaction.reply({content: result.message, flags: 64});

        } catch (error) {
            console.error(error);
            return interaction.reply("⚠️ 출석 처리 중 오류 발생");
        }
    }
};