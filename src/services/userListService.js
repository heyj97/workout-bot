const prisma = require("../database/prisma");

async function getUserList() {
    const users = await prisma.userinfo.findMany({
        orderBy: {
            created_at: "asc"
        }
    });

    if (users.length === 0) {
        return {
            message: "등록된 유저가 없습니다."
        };
    }

    const list = users
        .map((user, index) => {
            return `${index + 1}. ${user.user_name}`;
        })
        .join("\n");

    return {
        message: `👥 유저 목록\n\n${list}`
    };
}

module.exports = { getUserList };