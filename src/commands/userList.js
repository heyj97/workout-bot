const API_HEADERS = require("../constants/APIHeader");
module.exports = {
    name: "유저목록",
    
    async execute(interaction) {
        const BASE_URL = process.env.NODE_ENV === "production"
            ? process.env.PRODUCTION_URL
            : process.env.DEVELOP_URL;
        
        try {
            const response = await fetch(`${BASE_URL}/users`, { headers: API_HEADERS });
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
            
            let reply_msg = data
                .map(user =>
                    `👤 **${user.user_name}**\n` +
                    `⭐ 점수: ${user.point}pt\n` +
                    `🔥 최대연속출석: ${user.max_streak_days}일\n`
                )
                .join('\n')
                + '\n\n**총 유저 수:** ' + data.length;
            
            return interaction.reply({
                content: reply_msg,
                flags: 64
            });

        } catch (error) {
            console.error(error);

            return interaction.reply({
                content: "⚠️ API 요청 중 오류 발생",
                flags: 64
            });
        }
    }
};
