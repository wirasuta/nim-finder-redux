const dbQuery = require('./utils/db')

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

  const results = await dbQuery(
    'SELECT jurusan FROM kode_jurusan WHERE kode = ? LIMIT 1',
    [kodeJurusan]
  )

  const resData = {
    message: 'OK',
    namaJurusan: results.length ? results[0].jurusan : 'Unknown'
  }

  res.status(200).json(resData)
}
