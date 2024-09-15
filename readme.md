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
| `halo`      | Greet the bot, and it responds with `Halo juga! Ada yang bisa dibantu?`.     |
| `!menu`     | Displays the bot's available commands.                                      |
| `!listgroup`| List all the WhatsApp groups the bot is currently in.                       |
| `!send`     | Select a group to send a message to all its members.                        |

## Installation

1. Clone the repository:
   ```bash
   https://github.com/Wisyam/WaAuto-Sender.git
   cd whatsapp-auto-sender-bot
