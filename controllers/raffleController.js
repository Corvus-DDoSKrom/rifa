import QRCode from 'qrcode'
import fs from 'fs'

const qrCodes = new Set()
const winningNumbers = new Set()

async function generateQRCodeForRaffles (qrCount, winnerCount, prize, prizes) {
  cleanUpQRCodes()
  qrCodes.clear()

  const winningNumbers = generateWinningNumbers(winnerCount, qrCount)

  for (const raffleNumber of winningNumbers) {
    const prizeForWinner = prize
    qrCodes.add({ code: raffleNumber, isWinner: true, prize: prizeForWinner })
  }

  // Genera el resto de los códigos no ganadores
  while (qrCodes.size < qrCount) {
    const raffleNumber = generateRandomRaffleNumber(8)
    if (!winningNumbers.includes(raffleNumber)) {
      // Solo agrega el código si no es un ganador
      qrCodes.add({ code: raffleNumber, isWinner: false, prize: '' })
    }
  }

  console.log('Cantidad de qrCodes:', qrCodes.size)

  for (const qrCode of qrCodes) {
    const qrCodeData = `http://juegosguarani.com/check.html?raffle=${qrCode.code}`
    const filePath = `public/qrCodes/qrCode_${qrCode.code}.png`

    try {
      await generateQRCode(qrCodeData, filePath)
      console.log(`Generado QR: ${qrCode.code}`)
    } catch (err) {
      console.error('Error al generar el código QR:', err)
      // Trata el error apropiadamente
    }
  }
}

function generateWinningNumbers (winnerCount, qrCount) {
  const winningNumbers = new Set()
  while (winningNumbers.size < winnerCount) {
    const raffleNumber = generateRandomRaffleNumber(8)
    winningNumbers.add(raffleNumber)
  }
  return Array.from(winningNumbers)
}

function generateRandomRaffleNumber (length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const result = []
  for (let i = 0; i < length; i++) {
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length))
    result.push(randomCharacter)
  }
  const raffleNumber = result.join('')
  console.log(`Número QR generado: ${raffleNumber}`)
  return raffleNumber
}

function cleanUpQRCodes () {
  const directory = 'public/qrCodes'
  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory)
    for (const file of files) {
      fs.unlinkSync(`${directory}/${file}`)
      console.log(`Eliminada: ${file}`)
    }
  }
}

async function generateQRCode (data, filePath) {
  console.log(`Generando código QR para: ${data}, Guardando en: ${filePath}`)
  return new Promise((resolve, reject) => {
    QRCode.toFile(filePath, data, (err) => {
      if (err) {
        console.error(`Error al generar el código QR para ${data}:`, err)
        reject(err)
      } else {
        console.log(`Generado QR: ${filePath}`)
        resolve()
      }
    })
  })
}

export { generateQRCodeForRaffles, qrCodes, winningNumbers }
