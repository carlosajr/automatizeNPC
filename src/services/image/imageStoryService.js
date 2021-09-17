const fs = require('fs');
const dayjs = require('dayjs');
const { createCanvas, loadImage } = require('canvas');

const width = 1080;
const height = 1920;

async function create(request) {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');

	const templateBg = await loadImage('src/assets/images/templates/ne_story.jpg');
	context.drawImage(templateBg, 0, 0, width, height);

	writeDate(context, request);

	await drawImageTitle(context, request);

	writeTitle(context, request);

	writeRequests(context, request);

	const buffer = canvas.toBuffer('image/jpeg');

	const filePath = `src/assets/images/posts/npc_${request.data}.jpg`;

	fs.writeFileSync(filePath, buffer);

	return filePath;
}

function writeDate(ctx, request) {
	ctx.fillStyle = '#013a65';
	ctx.font = '42pt Sans';
	ctx.textBaseline = 'top';

	const text = request.contagem + 'º DIA - ' + dayjs(request.data).format('DD/MM');
	const textWidth = ctx.measureText(text).width;
	const textStartPos = (width - textWidth) / 2;
	ctx.fillText(text, textStartPos, 480);
}

async function drawImageTitle(ctx, request) {
	const imagemTitulo = await loadImage(request.imagemTitulo);
	const imgStartPos = (width - imagemTitulo.width) / 2;
	ctx.drawImage(imagemTitulo, imgStartPos, 600);
}

function writeTitle(ctx, request) {
	ctx.fillStyle = '#1b252e';

	const tituloWidth = ctx.measureText(request.titulo).width;
	const tituloStartPos = (width - tituloWidth) / 2;
	ctx.fillText(request.titulo, tituloStartPos, 780);
}

function writeRequests(ctx, request) {
	var posHeight = 1070;
	const lineHeightAdd = 55;
	const textBoxWidth = 900;

	ctx.fillStyle = '#013a65';
	ctx.font = '36pt Sans';

	const lettersPerLine = calculateLettersPerLine(textBoxWidth, ctx);

	for (const prayerRequest of request.requests) {
		const lines = breakLinesRequest(prayerRequest, lettersPerLine);

		for (const line of lines) {
			var lineWidth = ctx.measureText(line).width;
			var lineStartPos = (width - lineWidth) / 2;
			ctx.fillText(line, lineStartPos, posHeight);

			posHeight += lineHeightAdd;
		}
		posHeight += 80;
	}
}

function breakLinesRequest(prayerRequest, lettersPerLine) {
	const words = prayerRequest.split(' ');

	let sumCharacterSize = 0;
	let stringLine = '';

	let arrayString = [];

	for (let index = 0; index < words.length; index++) {
		let element = words[index];

		sumCharacterSize += element.length;

		if (sumCharacterSize < lettersPerLine) {
			stringLine += element + ' ';

			if (index + 1 < words.length) {
				continue;
			}
		}
		arrayString.push(stringLine.trim());

		sumCharacterSize = element.length;
		stringLine = element + ' ';
	}

	return arrayString;
}

function calculateLettersPerLine(textBoxWidth, ctx) {
	letterSize = calculateLetterSize(ctx);

	return parseInt(textBoxWidth / letterSize);
}

function calculateLetterSize(ctx) {
	const letterToCalculate = 'a';

	return ctx.measureText(letterToCalculate).width;
}

module.exports = { create }