const { getUserList } = require("../services/userListService");

module.exports = {
    name: "유저목록",

    async execute(interaction) {
        try {
            const result = await getUserList();

            return interaction.reply({
                content: result.message,
                flags: 64
            });

        } catch (error) {
            console.error(error);

            return interaction.reply({
                content: "⚠️ 유저 목록 조회 실패",
                flags: 64
            });
        }
    }
};