const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.static('public'));
app.use(cors());

let winningNumber = null;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/check', (req, res) => {
    const userNumber = req.query.number;
    if (userNumber == winningNumber) {
        res.json({ isWinner: true });
    } else {
        res.json({ isWinner: false });
    }
});

app.get('/winningNumber', (req, res) => {
    res.json({ winningNumber });
});

app.post('/raffle', (req, res) => {
    generateQRCodeForRaffles(100)
        .then(() => {
            res.send('Códigos QR generados para las rifas');
        })
        .catch(error => {
            console.error('Error al generar códigos QR:', error);
            res.status(500).send('Error al generar códigos QR');
        });
});

async function generateQRCodeForRaffles(count) {
    const raffles = [];
    const generatedQRs = new Set();

    // Genera el número ganador
    winningNumber = generateWinningNumber();
    const winningQRCodeData = `http://192.168.100.44:3000/check.html?raffle=${winningNumber}`;
    const winningQRFilePath = `public/qrCodes/qrCode_${winningNumber}.png`;
    raffles.push({
        number: winningNumber,
        qrCodePath: winningQRFilePath
    });
    await generateQRCode(winningQRCodeData, winningQRFilePath);

    // Genera los demás códigos QR
    while (raffles.length < count) {
        const raffleNumber = generateRandomRaffleNumber(3);
        if (!generatedQRs.has(raffleNumber)) {
            generatedQRs.add(raffleNumber);
            const qrCodeData = `http://192.168.100.44:3000/check.html?raffle=${raffleNumber}`;
            const filePath = `public/qrCodes/qrCode_${raffleNumber}.png`;

            raffles.push({
                number: raffleNumber,
                qrCodePath: filePath
            });
            await generateQRCode(qrCodeData, filePath);
        }
    }

    console.log('Número ganador:', winningNumber);
}

function generateWinningNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

async function generateQRCode(data, filePath) {
    return new Promise((resolve, reject) => {
        QRCode.toFile(filePath, data, (err) => {
            if (err) {
                console.error(`Error al generar el código QR:`, err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function generateRandomRaffleNumber(length) {
    return Math.floor(Math.random() * (10 ** length)).toString().padStart(length, '0');
}

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
