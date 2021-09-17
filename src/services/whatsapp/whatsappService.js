require('dotenv').config();
const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');

async function sendImage(ws, image) {
  numbers = getNumbersToSend();

  for (let number of numbers) {
    number = `${number}@c.us`;

    let media = MessageMedia.fromFilePath(image);
    let caption = 'A paz do senhor, oremos pelo Nordeste!';

    sendMessage(ws, number, media, caption)
  }
}

async function sendMessage(ws, number, media, caption) {
  setTimeout(async function () {
    await ws.sendMessage(number, media, { caption });
  }, 4000);
}

function getNumbersToSend() {
  stringNumbers = process.env.WHATSAPP_TO_SEND;

  return stringNumbers.split('|');
}

async function initializeService() {
  let ws;
  let dataSession;
  const SESSION_FILE_PATH = '../../assets/json/whatsappSession.json';

  const withSession = () => {
    dataSession = fs.readFileSync(SESSION_FILE_PATH);
    dataSession = JSON.parse(dataSession);

    ws = new Client({ session: dataSession });

    ws.on('ready', () => {
      console.log('Cliente está pronto!');

      return ws;
    });

    ws.on('auth_failure', () => {
      fs.unlinkSync(SESSION_FILE_PATH);
    });

    ws.initialize();
  }

  const withOutSession = () => {
    ws = new Client();

    ws.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });

    ws.on('ready', () => {
      console.log('Cliente está pronto!')
      return ws;
    });

    ws.on('auth_failure', () => {
      console.log('** O erro de autenticação regenera o QRCODE (Excluir o arquivo session.json) **');
      fs.unlinkSync(SESSION_FILE_PATH);
    });

    ws.on('authenticated', (session) => {
      dataSession = session;
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) console.log(err);
      });
    });

    ws.initialize();
  }

  (fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
}

module.exports = { initializeService, sendImage }