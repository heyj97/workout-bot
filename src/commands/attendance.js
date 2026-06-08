module.exports = {
    name: "출석",

    async execute(interaction) {
        try {
            const image = interaction.options.getAttachment("image");

            // 1. 이미지 체크
            if (!image) {
                return interaction.reply({
                    content: "⚠️ 출석 이미지를 첨부해주세요.",
                    flags: 64
                });
            }
            
            if (!image.contentType?.startsWith("image/")) {
                return interaction.reply({
                    content: "⚠️ 이미지 파일만 첨부 가능합니다.",
                    flags: 64
                });
            }

            const userDiscordId = interaction.user.id;
            const userName = interaction.user.displayName || interaction.user.username;
            const avatarUrl = interaction.user.displayAvatarURL();

            const BASE_URL =
                process.env.NODE_ENV === "production"
                    ? process.env.PRODUCTION_URL
                    : process.env.DEVELOP_URL;

            // --------------------------------------------------
            // 2. 유저 존재 체크
            // (서버 규칙: 존재하면 409 + isSuccess:false)
            // 존재하지 않으면 body를 기반으로 자동 가입(자동 가입 시 201 + isSuccess:true)
            // --------------------------------------------------
            const checkRes = await fetch(`${BASE_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_discord_id: userDiscordId,
                    user_name: userName,
                    user_discord_avatar_url: avatarUrl
                })
            });

            const checkData = await checkRes.json();

            // ❗ 이미 존재하는 경우 → create user 안 함
            if (checkData.isSuccess === false && checkRes.status === 409) {
                // 이미 유저 존재 → 출석만 진행
            } else if (!checkData.isSuccess) {
                return interaction.reply({
                    content: `⚠️ ${checkData.message || "유저 체크 실패"}`,
                    flags: 64
                });
            }
            
            // --------------------------------------------------
            // 3. 출석 추가
            // --------------------------------------------------
            const attendanceRes = await fetch(`${BASE_URL}/attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_discord_id: userDiscordId,
                    image_url: image.url
                })
            });

            const attendanceData = await attendanceRes.json();

            if (!attendanceData.isSuccess) {
                return interaction.reply({
                    content: `⚠️ ${attendanceData.message}`,
                    flags: 64
                });
            }

            // --------------------------------------------------
            // 4. 성공 응답
            // --------------------------------------------------
            return interaction.reply({
                content:
                    `✅ 출석 완료!\n`,
                flags: 64
            });

        } catch (error) {
            console.error(error);

            return interaction.reply({
                content: "⚠️ 출석 처리 중 오류 발생",
                flags: 64
            });
        }
    }
};