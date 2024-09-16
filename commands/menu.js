module.exports = async (client, message) => {
    const menuText = 'Menu Bot:\n' +
        '1. !ping - Cek Bot\n' +
        '2. halo - Sapa bot\n' +
        '3. !menu - Lihat menu\n' +
        '4. !listgroup - lihat group yang ada\n' +
        '5. !send - mengirim pesan ke semua member';
    await message.reply(menuText);
};
