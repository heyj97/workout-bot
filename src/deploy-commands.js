require("dotenv").config();

const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "출석",
        description: "오늘 출석하기",
    },
    {
        name: "랭킹",
        description: "랭킹 확인하기",
    },
    {
        name: "출석현황",
        description: "오늘 출석 현황 확인하기",
    },
    {
        name: "유저목록",
        description: "서버에 등록된 유저 목록 확인하기",
    },
    {
        name: "debug",
        description: "디버그 명령어"
    },
    {
        name: "도움말",
        description: "명령어 목록 확인하기"
    }
];

const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN
);

(async () => {
    try {
        console.log("명령어 등록 중...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("명령어 등록 완료");
    } catch (error) {
        console.error(error);
    }
})();