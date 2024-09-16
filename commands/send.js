const fs = require('fs');
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk menambah nomor ke file
function addNumberToFile(number) {
    fs.appendFileSync('../file/list.txt', `${number}\n`);
}

// Fungsi untuk membaca nomor dari list.txt
function readNumbersFromFile() {
    if (!fs.existsSync('../file/list.txt')) {
        fs.writeFileSync('../file/list.txt', '');
    }
    const data = fs.readFileSync('../file/list.txt', 'utf-8');
    return data.split('\n').filter(Boolean);
}

function getRandomMessage() {
    const messagesData = JSON.parse(fs.readFileSync('messages.json', 'utf-8'));
    const messages = messagesData.messages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

const DELAY_BETWEEN_CONTACTS = 10 * 60 * 1000;
const DELAY_BETWEEN_SESSIONS = 5 * 60 * 1000;
const MAX_MESSAGES_PER_SESSION = 10;

module.exports = async (client, message, stage, selectedGroup) => {
    let chats = await client.getChats();
    let groupList = chats.filter(chat => chat.isGroup);

    if (groupList.length > 0) {
        let response = 'Pilih grup yang ingin kamu kirim pesan:\n';
        groupList.forEach((group, index) => {
            response += `${index + 1}. ${group.name}\n`;
        });
        message.reply(response);
        stage[message.from] = 'chooseGroup'; // Set stage menjadi memilih grup
    } else {
        message.reply('Bot ini belum bergabung dengan grup apa pun.');
    }

    if (stage[message.from] === 'chooseGroup') {
        const groupIndex = parseInt(message.body) - 1;
        if (groupIndex >= 0 && groupIndex < groupList.length) {
            selectedGroup[message.from] = groupList[groupIndex];
            const randomMessage = getRandomMessage(); // Dapatkan pesan acak dari messages.json

            message.reply(`Mengirim pesan acak ke semua anggota grup "${groupList[groupIndex].name}":\n"${randomMessage}"`);

            // Kirim pesan acak ke semua anggota grup
            const sentNumbers = readNumbersFromFile();
            const participants = await groupList[groupIndex].participants;
            let count = 0;

            for (const participant of participants) {
                const participantId = participant.id._serialized;

                if (participantId !== message.from && !sentNumbers.includes(participantId)) {
                    await client.sendMessage(participantId, randomMessage);
                    console.log(`${colors.green}Pesan terkirim ke ${participantId}${colors.reset}`);

                    addNumberToFile(participantId);

                    await sleep(DELAY_BETWEEN_CONTACTS);

                    count++;
                    if (count >= MAX_MESSAGES_PER_SESSION) {
                        console.log(`${colors.yellow}Mencapai batas pesan per sesi. Menunggu 5 menit sebelum melanjutkan...${colors.reset}`);
                        await sleep(DELAY_BETWEEN_SESSIONS);
                        count = 0;
                    }
                }
            }

            message.reply('Pesan berhasil dikirim ke semua anggota grup.');
            delete stage[message.from];
            delete selectedGroup[message.from];
        } else {
            message.reply('Pilihan tidak valid. Silakan pilih nomor grup yang benar.');
        }
    }
};
