const fs = require('fs');
const dayjs = require('dayjs');

function getPedidoHoje() {
  const pedidos = getPedidos();

  const pedido = pedidos.find(
    dado => (dayjs().format('YYYY-MM-DD') === dayjs(dado.data).format('YYYY-MM-DD'))
  );

  return pedido;
}

function getPedidos() {
  const rawdata = fs.readFileSync('src/assets/json/dados.json');
  return JSON.parse(rawdata);
}

module.exports = { getPedidoHoje }

