// Import necessary modules
const express = require('express')
const oracledb = require('oracledb') // Adjust if you're using a different DB
const router = express.Router()
const {getPool} = require('./db') // Assuming you have a function to get DB connection pool

// Route to fetch all todos
router.get('/', async (req, res) => {
  let connection

  try {
    connection = await getPool().getConnection()
    const query = `SELECT id, title, status FROM todos`
    const result = await connection.execute(query)

    // Map over the result to create an array of todos
    const todos = result.rows.map(row => ({
      id: row[0], // Assuming the first column is id
      title: row[1], // Assuming the second column is title
      status: row[2], // Assuming the third column is status
    }))

    res.status(200).json(todos)
  } catch (err) {
    console.error('Error fetching todos:', err)
    res.status(500).json({error: err.message})
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
})

module.exports = router

// Route to create a new todo
// Route to create a new todo
router.post('/', async (req, res) => {
  const {title, status = 'pending'} = req.body
  let connection

  if (!title) {
    return res.status(400).json({error: 'Title is required'})
  }

  try {
    connection = await getPool().getConnection()
    const query = `INSERT INTO todos (title, status) VALUES (:title, :status) RETURNING id INTO :id`
    const idBind = {id: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}}

    const result = await connection.execute(query, {
      title: title,
      status: status,
      id: idBind.id,
    })

    await connection.commit()

    const newTodo = {
      id: result.outBinds.id[0],
      title,
      status,
    }

    res.status(201).json(newTodo)
  } catch (err) {
    console.error('Error creating todo:', err)
    res.status(500).json({error: err.message})
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
})

// Route to update a todo's status
// Route to update a todo's status
router.put('/:id', async (req, res) => {
  const {status} = req.body
  const id = req.params.id
  let connection

  if (!status) {
    return res.status(400).json({error: 'Status is required'})
  }

  try {
    connection = await getPool().getConnection()
    const query = `UPDATE todos SET status = :status WHERE id = :id`
    await connection.execute(query, {status, id})
    await connection.commit()

    res.status(200).json({id, status}) // Respond with the updated status
  } catch (err) {
    console.error('Error updating todo status:', err)
    res.status(500).json({error: err.message})
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
})
