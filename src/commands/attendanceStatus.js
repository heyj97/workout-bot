module.exports = {
    name: "출석현황",

    async execute(interaction) {
        try {
            const userDiscordId = interaction.user.id;

            const BASE_URL =
                process.env.NODE_ENV === "production"
                    ? process.env.PRODUCTION_URL
                    : process.env.DEVELOP_URL;

            const response = await fetch(
                `${BASE_URL}/attendance/check/${userDiscordId}`
            );

            // 1. HTTP 에러 처리 (404 포함)
            if (response.status === 404) {
                return interaction.reply({
                    content: "📅 오늘은 출석하지 않았어요.",
                    flags: 64
                });
            }

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const { isSuccess, message, data } =
                await response.json();

            // 2. 안전장치 (명시적 실패 처리)
            if (!isSuccess || !data) {
                return interaction.reply({
                    content: "📅 오늘은 출석하지 않았어요.",
                    flags: 64
                });
            }

            // 3. 출석 있음
            return interaction.reply({
                content: `📅 오늘은 출석했어요! ${data.attended_at}`,
                flags: 64
            });

        } catch (error) {
            console.error(error);

            return interaction.reply({
                content: "⚠️ 출석 현황 조회 중 오류 발생",
                flags: 64
            });
        }
    }
};