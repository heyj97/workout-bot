const { checkAttendanceRanking } = require("../services/rankingService");

module.exports = {
    name: "랭킹",

    async execute(interaction) {
        try {
            const result = await checkAttendanceRanking();

            await interaction.reply({
                content: result.message,
                flags: 64
            });

        } catch (error) {
            console.error("[RANKING ERROR]", error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "⚠️ 랭킹 조회 실패",
                    flags: 64
                });
            }
        }
    }
};