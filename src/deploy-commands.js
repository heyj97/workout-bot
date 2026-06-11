require("dotenv").config();

const {
    REST,
    Routes,
    ApplicationCommandOptionType,
} = require("discord.js");

const commands = [
    {
        name: "출석",
        description: "오늘 출석하기",
        options: [
            {
                name: "image",
                description: "출석 인증용 이미지",
                type: ApplicationCommandOptionType.Attachment,
                required: true,
            },
        ],
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
        description: "디버그 명령어",
    },
    {
        name: "도움말",
        description: "명령어 목록 확인하기",
    },
    {
        name: "pt",
        description: "AI에게 퍼스널 트레이닝 운동 스케줄을 받습니다.",
        options: [
            {
                name: "area",
                description: "운동 부위를 선택하세요.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "가슴",
                        value: "CHEST",
                    },
                    {
                        name: "등",
                        value: "BACK",
                    },
                    {
                        name: "하체",
                        value: "LEG",
                    },
                ],
            },
            {
                name: "level",
                description: "운동 강도를 선택하세요.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "하",
                        value: "LOW",
                    },
                    {
                        name: "중",
                        value: "MIDDLE",
                    },
                    {
                        name: "상",
                        value: "HIGH",
                    },
                ],
            },
            {
                name: "goal",
                description: "운동 목표를 선택하세요.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "근비대",
                        value: "MUSCLE_GAIN",
                    },
                    {
                        name: "다이어트",
                        value: "DIET",
                    },
                    {
                        name: "체력증진",
                        value: "STRENGTH",
                    },
                ],
            },
        ],
    },
];

const token = process.env.DISCORD_TOKEN?.trim();
const clientId = process.env.CLIENT_ID?.trim();
const guildId = process.env.GUILD_ID?.trim();

if (!token) {
    throw new Error("DISCORD_TOKEN이 .env에 없습니다.");
}

if (!clientId) {
    throw new Error("CLIENT_ID가 .env에 없습니다.");
}

if (!guildId) {
    throw new Error("GUILD_ID가 .env에 없습니다.");
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("명령어 등록 중...");

        console.log("TOKEN EXISTS:", Boolean(token));
        console.log("TOKEN LENGTH:", token?.length);
        console.log("CLIENT_ID:", clientId);
        console.log("GUILD_ID:", guildId);

        const app = await rest.get(Routes.oauth2CurrentApplication());

        console.log("TOKEN APP ID:", app.id);
        console.log("TOKEN APP NAME:", app.name);
        
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commands,
            }
        );

        console.log("명령어 등록 완료");
    } catch (error) {
        console.error("명령어 등록 실패");
        console.error(error);
    }
})();