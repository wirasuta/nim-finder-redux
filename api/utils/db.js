const mysql = require('serverless-mysql')

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
})

module.exports = async (query, args) => {
  const results = await db.query(query, args)
  await db.end()
  return results
}
