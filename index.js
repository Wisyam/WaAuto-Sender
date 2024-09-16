const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const figlet = require('figlet');
const fs = require('fs');
const config = require('./config.json');
const sendCommand = require('./commands/send.js');
const allowedNumbers = config.allowedNumbers;
const menuCommand = require('./commands/menu.js')
const listGroupCommand = require('./commands/listgroup.js')
const sendCommand = require('./commands/send.js')

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
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',   // Disable /dev/shm usage
            '--disable-logging',         // Nonaktifkan logging Chrome
            // '--disable-gpu',             // Nonaktifkan penggunaan GPU
            '--single-process',          // Gunakan proses tunggal
            '--no-zygote',               // Nonaktifkan proses zygote
        ]
    }
});
// Daftar nomor yang diizinkan (whitelist)
let stage = {};
let selectedGroup = {};
let groupList = [];

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

function isAuthorized(senderNumber) {
    return allowedNumbers.includes(senderNumber);
}

// Event saat pesan diterima
client.on('message', async message => {
    const senderNumber = message.from;

    if (message.isGroupMsg) return;

    if (isAuthorized(senderNumber)) {
        if (message.body === '!menu') {
            await menuCommand(client, message);
        } else if (message.body === '!listgroup') {
            await listGroupCommand(client, message);
        } else if (message.body === '!send') {
            // Logic for sending messages
            const chats = await client.getChats();
            const groupList = chats.filter(chat => chat.isGroup);
            if (groupList.length > 0) {
                let response = 'Pilih grup yang ingin kamu kirim pesan:\n';
                groupList.forEach((group, index) => {
                    response += `${index + 1}. ${group.name}\n`;
                });
                await message.reply(response);
                stage[senderNumber] = 'chooseGroup';
            } else {
                await message.reply('Bot ini belum bergabung dengan grup apa pun.');
            }
        } else if (stage[senderNumber] === 'chooseGroup') {
            const groupIndex = parseInt(message.body) - 1;
            if (groupIndex >= 0 && groupIndex < groupList.length) {
                selectedGroup[senderNumber] = groupList[groupIndex];
                await message.reply(`Grup "${groupList[groupIndex].name}" dipilih. Sekarang kirimkan pesan.`);
                stage[senderNumber] = 'enterMessage';
            } else {
                await message.reply('Pilihan tidak valid.');
            }
        } else if (stage[senderNumber] === 'enterMessage') {
            await sendCommand(client, message, senderNumber, stage, selectedGroup, groupList);
        }
    } else {
    console.log(`${colors.red}Akses ditolak untuk nomor ${senderNumber}${colors.reset}`);
    }
});

client.initialize();