import QRCode from 'qrcode'
import fs from 'fs'

let winningNumbers = []

async function generateQRCodeForRaffles (qrCount, winnerCount) {
  cleanUpQRCodes()

  // Crear un conjunto de códigos QR para los ganadores
  const winningQRs = new Set()

  while (winningQRs.size < winnerCount) {
    const raffleNumber = generateRandomRaffleNumber(8)
    winningQRs.add(raffleNumber)
  }

  winningNumbers = Array.from(winningQRs)
  console.log('Números ganadores:', winningNumbers)

  // Crear códigos QR para todos los códigos (ganadores y no ganadores)
  const allQRs = Array.from(winningQRs) // Copia los ganadores al conjunto de todos los códigos QR

  while (allQRs.length < qrCount) {
    const raffleNumber = generateRandomRaffleNumber(8)
    allQRs.push(raffleNumber)
  }

  for (let i = 0; i < allQRs.length; i++) {
    const raffleNumber = allQRs[i]
    const qrCodeData = `http://juegosguarani.com/check.html?raffle=${raffleNumber}`
    const filePath = `public/qrCodes/qrCode_${raffleNumber}.png`

    await generateQRCode(qrCodeData, filePath)
    console.log(`Generado QR ${i + 1} de ${qrCount}`)
  }
}

function generateRandomRaffleNumber (length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
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
  return new Promise((resolve, reject) => {
    QRCode.toFile(filePath, data, (err) => {
      if (err) {
        console.error('Error al generar el código QR:', err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export { generateQRCodeForRaffles, winningNumbers }
