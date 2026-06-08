const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "도움말",

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("📌 명령어 목록")
            .setColor(0x00ff99)
            .addFields(
                { name: "/출석", value: "오늘 운동 등록" },
                { name: "/랭킹", value: "유저의 점수랭킹 확인" },
                { name: "/출석현황", value: "오늘 출석 여부 확인" },
                { name: "/유저목록", value: "등록된 유저 목록" },
                { name: "/debug", value: "운영자 전용" }
            );

        return interaction.reply({
            embeds: [embed],
            flags: 64
        });
    }
};