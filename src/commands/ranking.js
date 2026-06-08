const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "랭킹",

    async execute(interaction) {
        try {
            const BASE_URL =
                process.env.NODE_ENV === "production"
                    ? process.env.PRODUCTION_URL
                    : process.env.DEVELOP_URL;

            const response = await fetch(`${BASE_URL}/rank/point`);

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const { isSuccess, message, data } = await response.json();

            if (!isSuccess) {
                return interaction.reply({
                    content: `⚠️ ${message}`,
                    flags: 64
                });
            }
            
            const userId = interaction.user.id;
            
            const description = data.map((user, index) => {
                    const medal = ["🥇", "🥈", "🥉"][index] || "";
                    const rank = index + 1;
                    
                    const line = medal
                        ? `${medal} ${user.user_name} : ${user.point}pt`
                        : `${rank}. ${user.user_name} : ${user.point}pt`;

                    return user.user_discord_id == userId
                        ? `➡️ **${line}**`
                        : line;
                })
                .join("\n");

            const embed = new EmbedBuilder()
                .setTitle("🏆 랭킹")
                .setDescription(description)
                .setColor(0xF1C40F)
                .setFooter({ text: `TOP 10까지 표시됩니다.` });

            return interaction.reply({
                embeds: [embed],
                flags: 64
            });

        } catch (error) {
            console.error(error);

            return interaction.reply({
                content: "⚠️ 랭킹 조회 중 오류 발생",
                flags: 64
            });
        }
    }
};