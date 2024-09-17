const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const figlet = require('figlet');
const fs = require('fs');

// ANSI escape codes untuk warna
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underline: '\x1b[4m',
    inverse: '\x1b[7m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

// Inisialisasi client dengan autentikasi lokal
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,  // Nonaktifkan mode headless untuk membuka Chrome
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',   // Disable /dev/shm usage
            '--disable-logging',         // Nonaktifkan logging Chrome
            '--disable-gpu',             // Nonaktifkan penggunaan GPU
            '--single-process',          // Gunakan proses tunggal
            '--no-zygote',               // Nonaktifkan proses zygote
        ]
    }
});

// Daftar nomor yang diizinkan (whitelist)
const allowedNumbers = [
    '6283831973277@c.us'
];

// Deklarasi variabel
let stage = {};
let selectedGroup = {};
let groupList = [];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Atur delay 10 menit per kontak dan 5 menit per sesi
const DELAY_BETWEEN_CONTACTS = 2 * 60 * 1000; // 2 menit dalam milidetik
const DELAY_BETWEEN_SESSIONS = 5 * 60 * 1000; // 5 menit dalam milidetik
const MAX_MESSAGES_PER_SESSION = 10; // Batasi jumlah pesan per sesi

function addNumberToFile(number) {
    fs.appendFileSync('list.txt', `${number}\n`);
}

// Fungsi untuk membaca nomor dari list.txt
function readNumbersFromFile() {
    if (!fs.existsSync('list.txt')) {
        fs.writeFileSync('list.txt', ''); // Buat file jika tidak ada
    }
    const data = fs.readFileSync('list.txt', 'utf-8');
    return data.split('\n').filter(Boolean); // Buat array dari nomor di file
}

// Fungsi untuk mencetak teks fancy
function printFancyTitle() {
    figlet.text('Bot Auto Sender', { font: 'Slant' }, (err, data) => {
        if (err) {
            console.log(`${colors.red}Error creating ASCII art${colors.reset}`);
            console.dir(err);
            return;
        }
        console.log(`${colors.cyan}${data}${colors.reset}`);
        console.log(`${colors.green}Created by @Icam${colors.reset}`);
        console.log(`${colors.yellow}${'-'.repeat(40)}${colors.reset}`);
    });
}

// Fungsi untuk mencetak garis pemisah
function printSeparator(char = '-', length = 40) {
    console.log(`${colors.red}${char.repeat(length)}${colors.reset}`);
}

// Event untuk menampilkan QR code di terminal
client.on('qr', (qr) => {
    printSeparator('-', 40);
    console.log(`${colors.blue}Scan the QR code below to connect.${colors.reset}`);
    printSeparator('-', 40);
    qrcode.generate(qr, { small: true });
    printSeparator('-', 40);
});

// Event ketika bot siap digunakan
client.on('ready', () => {
    printSeparator('-', 40);
    printFancyTitle();
    printSeparator('-', 40);
    console.log(`${colors.green}Bot sudah siap!${colors.reset}`);
    printSeparator('-', 40);
});

// Fungsi untuk cek apakah nomor ada di whitelist
function isAuthorized(senderNumber) {
    return allowedNumbers.includes(senderNumber);
}

// Event saat pesan diterima
client.on('message', async message => {
    const senderNumber = message.from;
    
    if (message.isGroupMsg) {
        // Jika pesan berasal dari grup, bot akan mengabaikan pesan
        console.log(`${colors.dim}Mengabaikan pesan dari grup: ${message.from}${colors.reset}`);
        return;
    }

    // Cek apakah pengirim termasuk dalam whitelist
    if (isAuthorized(senderNumber)) {
        console.log(`${colors.cyan}Pesan diterima dari ${senderNumber}: ${message.body}${colors.reset}`);
        // Respon bot
        if (message.body === '!ping') {
            message.reply('Pong!');
        } else if (message.body.toLowerCase() === 'halo') {
            message.reply('Halo juga! Ada yang bisa dibantu?');
        } else if (message.body === '!menu') {
            message.reply('Menu Bot:\n1. !ping - Cek Bot\n2. halo - Sapa bot\n3. !menu - Lihat menu\n4. !listgroup - lihat group yang ada\n5. !send - mengirim pesan ke semua member');
        } else if (message.body === '!listgroup') {
            // Dapatkan daftar grup
            let chats = await client.getChats();
            let groupChats = chats.filter(chat => chat.isGroup);

            // Cek apakah bot ada dalam grup
            if (groupChats.length > 0) {
                let groupList = 'Daftar Grup:\n';
                groupChats.forEach((group, index) => {
                    groupList += `${index + 1}. ${group.name}\n`;
                });

                message.reply(groupList);
            } else {
                message.reply('Bot ini belum bergabung dengan grup apa pun.');
            }
        } else if (message.body === '!send') {
            // Ambil daftar grup
            let chats = await client.getChats();
            groupList = chats.filter(chat => chat.isGroup);

            if (groupList.length > 0) {
                let response = 'Pilih grup yang ingin kamu kirim pesan:\n';
                groupList.forEach((group, index) => {
                    response += `${index + 1}. ${group.name}\n`;
                });
                message.reply(response);
                stage[senderNumber] = 'chooseGroup'; // Set stage menjadi memilih grup
            } else {
                message.reply('Bot ini belum bergabung dengan grup apa pun.');
            }
        } else if (stage[senderNumber] === 'chooseGroup') {
            // Pengguna memilih grup    
            const groupIndex = parseInt(message.body) - 1;
            if (groupIndex >= 0 && groupIndex < groupList.length) {
                selectedGroup[senderNumber] = groupList[groupIndex];
                message.reply(`Grup "${groupList[groupIndex].name}" dipilih. Sekarang kirimkan pesan yang ingin kamu kirim ke semua member grup.`);
                stage[senderNumber] = 'enterMessage'; // Set stage menjadi memasukkan pesan
            } else {
                message.reply('Pilihan tidak valid. Silakan pilih nomor grup yang benar.');
            }
        } else if (stage[senderNumber] === 'enterMessage') {
            // Pengguna memasukkan pesan yang ingin dikirim
            const group = selectedGroup[senderNumber];
            const messageToSend = message.body;
            message.reply(`Mengirim pesan ke semua anggota grup "${group.name}"...`);

            // Ambil nomor yang sudah ada di list.txt
            const sentNumbers = readNumbersFromFile();

            // Kirim pesan ke semua member grup (kecuali bot dan yang sudah di list.txt)
            const participants = await group.participants;
            let count = 0; // Counter untuk jumlah pesan yang dikirim
            for (const participant of participants) {
                const participantId = participant.id._serialized;

                // Skip pengirim dan nomor yang sudah ada di list.txt
                if (participantId !== senderNumber && !sentNumbers.includes(participantId)) {
                    await client.sendMessage(participantId, messageToSend);
                    console.log(`${colors.green}Pesan terkirim ke ${participantId}${colors.reset}`);

                    // Tambahkan nomor ke list.txt
                    addNumberToFile(participantId);

                    // Beri jeda 10 menit sebelum mengirim ke kontak berikutnya
                    await sleep(DELAY_BETWEEN_CONTACTS);

                    count++;
                    if (count >= MAX_MESSAGES_PER_SESSION) {
                        console.log(`${colors.yellow}Mencapai batas pesan per sesi. Menunggu 5 menit sebelum melanjutkan...${colors.reset}`);
                        await sleep(DELAY_BETWEEN_SESSIONS); // Tunggu 5 menit
                        count = 0; // Reset counter
                    }
                } else {
                    console.log(`${colors.yellow}Mengabaikan nomor ${participantId}, sudah pernah dikirim.${colors.reset}`);
                }
            }

            message.reply('Pesan berhasil dikirim ke semua anggota grup.');
            delete stage[senderNumber]; // Hapus stage setelah selesai
            delete selectedGroup[senderNumber]; // Hapus grup yang dipilih setelah selesai
        }
    } else {
        console.log(`${colors.red}Akses ditolak untuk nomor ${senderNumber}${colors.reset}`);
    }
});

// Jalankan client
client.initialize();
