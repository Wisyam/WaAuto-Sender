# WhatsApp Auto Sender Bot

WhatsApp Auto Sender Bot is a simple automation bot built using the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library. This bot allows you to automate messaging tasks in WhatsApp, including responding to specific commands and sending messages to all members of a selected group.

## Features

- **Auto Reply**: Respond to specific commands like `!ping`, `halo`, and `!menu`.
- **Group Listing**: List all the groups that the bot is part of using the `!listgroup` command.
- **Send Message to Group Members**: Select a group and send a message to all its members with the `!send` command.
- **QR Code Authentication**: Use the WhatsApp QR code to authenticate the bot.

## Commands

| Command     | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| `!ping`     | Check if the bot is online, responds with `Pong!`.                          |
| `halo`      | Greet the bot, and it responds with `Halo juga! Ada yang bisa dibantu?`.    |
| `!menu`     | Displays the bot's available commands.                                      |
| `!listgroup`| List all the WhatsApp groups the bot is currently in.                       |
| `!send`     | Select a group to send a message to all its members.                        |

## Installation

1. Clone the repository:
   ```bash
   https://github.com/Wisyam/WaAuto-Sender.git
   cd whatsapp-auto-sender-bot

2. Instal dependensi yang diperlukan:
   ```bash
   npm install
3. Jalankan bot:
   ```
   node index.js
4. Autentikasi dengan WhatsApp:
   - Setelah menjalankan bot, QR code akan muncul di terminal. Scan QR code ini menggunakan aplikasi WhatsApp di ponselmu untuk menghubungkan akun WhatsApp dengan bot.

2. **Proses Command**: 
   Bot mendengarkan pesan yang diterima dan memproses perintah seperti `!ping`, `halo`, `!menu`, `!listgroup`, dan `!send`.

3. **Pengiriman Pesan ke Anggota Grup**:
   Setelah perintah `!send` digunakan, bot akan menampilkan daftar grup dan meminta pengguna untuk memilih grup. Setelah memilih, bot akan mengirim pesan yang ditentukan ke semua anggota grup.

## Dependency

Bot ini menggunakan beberapa library eksternal, antara lain:

- [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
- [`qrcode-terminal`](https://www.npmjs.com/package/qrcode-terminal)
- [`figlet`](http://www.figlet.org/): Digunakan untuk menampilkan teks ASCII art di terminal.

## Kontribusi

Kontribusi untuk proyek ini sangat diterima! Silakan fork repository ini dan buat pull request dengan fitur atau perbaikan yang ingin ditambahkan.
