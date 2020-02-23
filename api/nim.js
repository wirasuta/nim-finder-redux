const mysql = require('mysql')
const metaphone = require('metaphone')
const { promisify } = require('util')

const ITEM_PER_PAGE = 20

const _isNumeric = str => {
  return /^\d+$/.test(str)
}

const _exactExist = (list, query) => {
  for (let i = 0; i < list.length; i++) {
    const name = list[i].name
    if (name.toLowerCase() === query.toLowerCase()) return true

    const nim_tpb = list[i].nim_tpb
    if (nim_tpb.toLowerCase() === query.toLowerCase()) return true

    const nim_jurusan = list[i].nim_jurusan
    if (nim_jurusan.toLowerCase() === query.toLowerCase()) return true
  }

  return false
}

const _removeDupByID = (listOriginal, listToBeStrip) => {
  for (let i = 0; i < listOriginal.length; ++i) {
    for (let j = 0; j < listToBeStrip.length; ++j) {
      if (listOriginal[i].ID === listToBeStrip[j].ID)
        listToBeStrip.splice(j--, 1)
    }
  }

  return listToBeStrip
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
  if (!_isNumeric(query.p)) {
    // TODO: Check for null or undefined
    res.status(400).json({ message: 'Invalid pagination' })
    return
  }

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  const page = +query.p
  const rawQuery = `%${query.q}%`
  const queryArray = query.q.split(' ')

  const nimLikeArray = queryArray
    .filter(el => _isNumeric(el))
    .map(el => `%${el}%`)

  const rawStringArray = queryArray
    .filter(el => !_isNumeric(el))
    .map(el => `%${el}%`)

  const metaphoneArray = rawStringArray.map(el => `%${metaphone(el)}%`)

  let sqlString = `SELECT ID, name, nim_tpb, nim_jurusan 
    FROM nim 
    WHERE nim_tpb LIKE ? 
    OR nim_jurusan LIKE ? 
    OR name LIKE ? 
    LIMIT ${page * ITEM_PER_PAGE}, ${(page + 1) * ITEM_PER_PAGE}`

  let sqlStringExtended =
    'SELECT ID, name, nim_tpb, nim_jurusan FROM nim WHERE ('
  sqlStringExtended += nimLikeArray.length
    ? nimLikeArray
        .map(_ => 'nim_tpb LIKE ? OR nim_jurusan LIKE ?')
        .join(' OR ') + ') AND ('
    : ''
  sqlStringExtended += metaphoneArray.length
    ? '(' + metaphoneArray.map(_ => 'metaphone LIKE ?').join(' OR ') + ') AND '
    : ''
  sqlStringExtended += rawStringArray.length
    ? '(' + rawStringArray.map(_ => 'name LIKE ?').join(' AND ') + ')) '
    : ''
  sqlStringExtended += `LIMIT ${page * ITEM_PER_PAGE}, ${(page + 1) *
    ITEM_PER_PAGE}`

  connection.connect()

  let results = await promisify(connection.query).bind(connection)(sqlString, [
    rawQuery,
    rawQuery,
    rawQuery
  ])

  let resultsExtended = []
  if (page === 0 && results.length < 5 && !_exactExist(results, query.q)) {
    resultsExtended = await promisify(connection.query).bind(
      connection
    )(sqlStringExtended, [
      ...nimLikeArray,
      ...nimLikeArray,
      ...metaphoneArray,
      ...rawStringArray
    ])

    resultsExtended = _removeDupByID(results, resultsExtended)
  }

  results = [...results, ...resultsExtended]

  const resData = {
    message: 'OK',
    data: results
  }

  res.status(200).json(resData)
  connection.end(() => {
    return
  })
}
