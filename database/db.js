import mysql2 from 'mysql2'

const connector = mysql2.createConnection({
  host: '167.114.101.9',
  port: '3306',
  user: 'juegosguarani_corvusddoskrom',
  password: 'Mr27112017Sj',
  database: 'juegosguarani_nhanderifa'
})

connector.connect(err => {
  if (err) {
    console.log('Connection error is: ' + err)
    return
  }
  console.log('¡Conectado con éxito!')
})

export default connector
