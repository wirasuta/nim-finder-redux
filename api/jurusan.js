const mysql = require('mysql')
const { promisify } = require('util')

const _isNumeric = str => {
  return /^\d+$/.test(str)
}

module.exports = async (req, res) => {
  const { query, method } = req

  if (method != 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  if (query === undefined) {
    res.status(400).json({ message: 'Invalid request' })
    return
  }
  if (!query.q) {
    res.status(400).json({ message: 'No query' })
    return
  }
  if (query.q.length < 3) {
    res.status(400).json({ message: 'Query too short' })
    return
  }
  if (!_isNumeric(query.q)) {
    // TODO: Check for null or undefined
    res.status(400).json({ message: 'Invalid kode jurusan' })
    return
  }

  const kodeJurusan = query.q

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  connection.connect()

  const results = await promisify(connection.query).bind(
    connection
  )('SELECT jurusan FROM kode_jurusan WHERE kode = ? LIMIT 1', [kodeJurusan])

  const resData = {
    message: 'OK',
    namaJurusan: results.length ? results[0].jurusan : 'Unknown'
  }

  res.status(200).json(resData)
  connection.end(() => {
    return
  })
}
