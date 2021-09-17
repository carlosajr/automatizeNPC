require('dotenv').config();
const Instagram = require('instagram-web-api');

async function publicarFoto(filePath, mode) {
  const username = process.env.INSTAGRAM_USER;
  const password = process.env.INSTAGRAM_PASS;

  const client = new Instagram({ username, password });

  console.log(username);

  await client.login();

  await client
    .uploadPhoto({ photo: filePath, caption: '', post: mode })
    .catch(function (e) {
      console.log('ERRO:', e);
    })
}

module.exports = { publicarFoto }