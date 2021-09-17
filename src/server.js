require('dotenv').config();
const express = require('express');
const path = require('path');
const whatsappInitializeService = require('./services/whatsapp/whatsappInitializeService')

const generateController = require('./controllers/generateController');

(async () => {
  const app = express();
  app.use(express.json());

  const port = process.env.SERVER_PORT;

  const ws = await whatsappInitializeService.initialize();

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile('src/pages/index.html', { root: './' });
  });

  app.post('/generate', async (req, res) => {
    const { postarStory, enviarWhatsapp } = req.body;

    try {
      await generateController.generate(postarStory, enviarWhatsapp, ws);

      res.json({ msg: "Gerando imagem!" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
})();
