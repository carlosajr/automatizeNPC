require('dotenv').config();
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = process.env.WHATSAPP_SESSION_FILE;
console.log(SESSION_FILE_PATH);

async function initialize() {

  const withSession = () => {
    dataSession = fs.readFileSync(SESSION_FILE_PATH);
    dataSession = JSON.parse(dataSession);

    ws = new Client({ session: dataSession });

    ws.on('ready', () => {
      console.log('Cliente do whatsapp está pronto!');
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

module.exports = { initialize }