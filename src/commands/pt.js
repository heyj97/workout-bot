const API_HEADERS = require("../constants/APIHeader");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pt",

    async execute(interaction) {
        try {
            const userDiscordId = interaction.user.id;

            const BASE_URL =
                process.env.NODE_ENV === "production"
                    ? process.env.PRODUCTION_URL
                    : process.env.DEVELOP_URL;

            const response = await fetch(`${BASE_URL}/ai-pt`, {
                method: "POST",
                headers: API_HEADERS,
                body: JSON.stringify({
                    user_discord_id: userDiscordId,
                    area: interaction.options.getString("area"),
                    level: interaction.options.getString("level"),
                    goal: interaction.options.getString("goal"),
                }),
            });

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            const exercises = data.exercises;

            if (!Array.isArray(exercises)) {
                throw new Error("exercises 데이터가 배열이 아닙니다.");
            }

            const area = interaction.options.getString("area");
            const level = interaction.options.getString("level");
            const goal = interaction.options.getString("goal");

            const embed = new EmbedBuilder()
                .setTitle("AI PT 운동 스케줄")
                .setDescription(`운동 부위: **${area}**\n운동 강도: **${level}**\n운동 목표: **${goal}**`)
                .addFields(
                    exercises.map((exercise, index) => ({
                        name: `${index + 1}. ${exercise.name}`,
                        value: `세트: **${exercise.sets}세트** / 반복: **${exercise.reps}회**`,
                    }))
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            console.error(error);

            return interaction.reply({
                content: "⚠️ PT 스케줄 요청 처리 중 오류 발생",
                flags: 64,
            });
        }
    },
};