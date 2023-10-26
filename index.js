import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import indexRoutes from './routes/index.routes.js'
import { PORT } from './config/config.js'
import { generateQRCodeForRaffles, qrCodes, winningNumbers } from './controllers/raffleController.js'

const app = express()

dotenv.config({ path: './env/.env' })

app.use(cors())
app.use(cookieParser())

app.set('views', './public/views')
app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(express.static('./public/views'))
app.use(express.static('./public/components'))
app.use(express.static('./public/assets/css'))
app.use(express.static('./public/assets/img'))
app.use(express.static('./public/assets/js'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(function (req, res, next) {
  if (!req.user) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  }
  next()
})

app.get('/getQrCodes', (req, res) => {
  res.json({ qrCodes })
})

app.get('/check', (req, res) => {
  const userNumber = req.query.number
  const isWinner = winningNumbers.has(userNumber)
  res.json({ isWinner })
})

app.get('/winningNumbers', (req, res) => {
  const winningNumbersArray = Array.from(winningNumbers)
  res.json({ qrCodes: Array.from(qrCodes), winningNumbers: winningNumbersArray })
})

app.post('/raffle', async (req, res) => {
  const qrCount = parseInt(req.query.qrCount)
  const winnerCount = parseInt(req.query.winnerCount)
  const prize = req.body.prize

  if (qrCount < 1 || winnerCount < 1) {
    res.status(400).send('Ingrese una cantidad válida de códigos QR y ganadores (al menos 1 de cada uno).')
    return
  }

  // Define los premios para los códigos ganadores
  const prizes = {} // Aquí debes definir los premios asociados a los códigos ganadores

  try {
    await generateQRCodeForRaffles(qrCount, winnerCount, prize, prizes)
    res.send(`Códigos QR generados: ${qrCount}, Ganadores: ${winnerCount}`)
  } catch (error) {
    console.error('Error al generar códigos QR:', error)
    res.status(500).send('Error al generar códigos QR')
  }
})

app.use(indexRoutes)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
