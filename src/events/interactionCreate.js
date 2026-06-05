const attendance = require("../commands/attendance");
const ranking = require("../commands/ranking");
const attendanceStatus = require("../commands/attendanceStatus");

const commands = new Map();

commands.set(attendance.name, attendance);
commands.set(ranking.name, ranking);
commands.set(attendanceStatus.name, attendanceStatus);

module.exports = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
};