import { Client } from 'discord.js';
import { config } from 'dotenv';
import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

// Setup for dotenv
config();
if (!process.env.TOKEN) { throw new Error('TOKEN must be provided'); }

// Setup for discord.js
const client = new Client();
client.token = process.env.TOKEN;

let timerObj = {};

try {
    timerObj = readFileSync(join(__dirname, './timer.json'));
} catch (e) {
    console.log('Error: timer.json must exist in same directory as index');
    process.exit(1);
}

const timer = JSON.parse(timerObj.toString());
let lastUsed = 0;

// discord.js message event
client.on('message', async (msg) => {

    const message = msg;

    // Prevent from responding to and logging other bots
    if (!message.author) { return; }
    if (!message.channel) { return; }
    if (message.author.bot) { return; }
    if (!message.content) { return; }

    const prefix = '!';
    if (message.content[0] === prefix) {
        const args = message.content.trim().split(' ');
        const command = (args.shift() || '').toLowerCase().substring(prefix.length);
        const NUMBERS_REGEX = /[^(0-9)]/g;

        if (command !== 'hardlytimer') { return; }

        const setTimer = args[0];
        if (NUMBERS_REGEX.test(setTimer)) {
            message.channel.send('Error: Timer must be set in seconds (no alpha/special characters)');
            return;
        }

        const obj = { timer: setTimer };
        writeFile(join(__dirname, './timer.json'), JSON.stringify(obj), (err) => {
            if (err) {
                return;
            }
            timer.timer = setTimer;
        });

        message.channel.send('Timer updated successfully!');

    } else {

        if ((Date.now() / 1000) - lastUsed < timer.timer) {
            return;
        }

        lastUsed = Date.now() / 1000;

        const REMOVE_SPECIAL_REGEX = /[^A-Za-z0-9 ]/g;
        const END_IN_ER_REGEX = /...er$/gi;

        const removeSpecial = message.content.replace(REMOVE_SPECIAL_REGEX, '');
        const words = removeSpecial.trim().split(' ');

        if (END_IN_ER_REGEX.test(words[words.length - 1])) {
            message.channel.send(words[words.length - 1] + '? I hardly know \'er!');
        }
    }

});

// Login to discord and notify when completed.
client.login().then(() => {
  console.log('All done!');
});
