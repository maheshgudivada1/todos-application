const oracledb = require('oracledb')
const dotenv = require('dotenv')

dotenv.config()

async function initializeDB() {
  try {
    // Establish connection to the Oracle database
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    })

    console.log('Connected to the Oracle database.')

    // Create the `todos` table if it doesn't exist
    const connection = await oracledb.getConnection()
    const createTableQuery = `
            CREATE TABLE todos (
                id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                title VARCHAR2(255) NOT NULL,
                status VARCHAR2(50) DEFAULT 'pending'
            )
        `
    await connection.execute(createTableQuery)
    await connection.commit()
    connection.close()
  } catch (err) {
    console.error('Error initializing database', err)
  }
}

module.exports = {initializeDB, getPool: () => oracledb.getPool()}
