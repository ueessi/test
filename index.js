const { create, decryptMedia } = require('@open-wa/wa-automate')
const moment = require('moment')
const {tiktok, instagram, twitter, facebook} = require('./lib/dl-video')
const urlShortener = require('./lib/shortener')
const color = require("./lib/color")

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    cacheEnabled: false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
}

const opsys = process.platform;
if (opsys === "win32" || opsys === "win64") {
    serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys === "linux") {
    serverOption['browserRevision'] = '737027';
} else if (opsys === "darwin") {
    serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
create('Imperial', serverOption)
        .then(client => {
            console.log('[DEV] Red Emperor')
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            client.onMessage((message) => {
                msgHandler(client, message)
            })
        })
}

async function msgHandler (client, message) {
    try {
        const { type, body, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        const { pushname } = sender
        const { formattedTitle } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['quotes', 'assalamualaikum', 'P', 'thul', 'tul', 'hai', 'hallo', 'hi', 'halo', 'bot', 'selamat pagi', 'pagi', 'selamat siang', 'siang', 'selamat malam', 'malam', 'makasi', 'makasih', 'thanks', 'maacii', 'mas', 'mbak', 'mba', 'dek']
        const cmds = commands.map(x => x + '\\b').join('|'),
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : ''

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(formattedTitle))
            const args = body.trim().split(' ')
            const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
            switch (cmd[0]) {
                case 'assalamualaikum':
                    client.sendText(from, 'waalaikumsalam wr. wb.')
                    break
                case 'quotes':
                    client.sendText(from, randomline('status.txt'))
                case 'P':
                    client.sendText(from, 'bisa sopan dikit gak?')
                    break
                case 'hai':
                case 'hi':
                    client.sendText(from, 'hallo')
                    break
                case 'halo':
                case 'hallo':
                    client.sendText(from, 'hi')
                    break
                case 'thul':
                case 'tul':
                case 'mas':
                case 'mbak':
                case 'mba':
                case 'dek':
                    client.sendText(from, 'dalem')
                    break
                case 'selamat pagi':
                    client.sendText(from, 'selamat pagi')
                    break
                case 'selamat siang':
                    client.sendText(from, 'selamat siang')
                    break
                case 'selamat malam':
                    client.sendText(from, 'selamat malam')
                    break
                case 'makasi':
                case 'makasih':
                case 'thanks':
                case 'maacii':
                    client.sendText(from, 'sama sama')
                    break
            }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(formattedTitle))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err);
  });

startServer()
