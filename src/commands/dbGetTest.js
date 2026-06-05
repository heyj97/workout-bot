const prisma = require("../database/prisma");
client.once("clientReady", async () => {
    console.log(`${client.user.tag} 로그인`);

    const users = await prisma.userinfo.findMany();

    console.log(users);
});
