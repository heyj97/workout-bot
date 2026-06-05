module.exports = {
    name: "도움말",

    async execute(interaction) {
        const message =
            `📌 **명령어 목록**

🏋️ /출석
→ 오늘 운동(출석) 등록

📊 /랭킹
→ 현재 미구현

📅 /출석현황
→ 오늘 출석 여부 확인

👥 /유저목록
→ 등록된 유저 목록 확인

🛠 /debug
→ 운영자 전용 (DB / 서버 / cron 상태 확인)
`;

        return interaction.reply({
            content: message,
            flags: 64 // ephemeral
        });
    }
};