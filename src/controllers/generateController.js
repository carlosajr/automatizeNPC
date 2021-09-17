const dataService = require('../services/data/dataService');
const imageStoryService = require('../services/image/imageStoryService');
const instagramService = require('../services/instagram/instagramService');
const whatsappService = require('../services/whatsapp/whatsappService');

async function generate(postarStory, enviarWhatsapp, ws) {
  console.log(postarStory, enviarWhatsapp, ws);
  const pedido = dataService.getPedidoHoje();

  if (!pedido) {
    throw new Error('Não foi encontrado pedido para hoje');
  }

  const image = await imageStoryService.create(pedido);
  console.log('Imagem gerada');

  if (postarStory) {
    await instagramService.publicarFoto(image, 'story');
    console.log('Imagem publicada');
  }

  if (enviarWhatsapp) {
    await whatsappService.sendImage(ws, image, pedido);
    console.log('enviada');
  }

}

module.exports = { generate }