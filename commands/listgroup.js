// commands/listgroup.js
module.exports = async (client, message) => {
    let chats = await client.getChats();
    let groupChats = chats.filter(chat => chat.isGroup);

    if (groupChats.length > 0) {
        let groupList = 'Daftar Grup:\n';
        groupChats.forEach((group, index) => {
            groupList += `${index + 1}. ${group.name}\n`;
        });
        message.reply(groupList);
    } else {
        message.reply('Bot ini belum bergabung dengan grup apa pun.');
    }
};
