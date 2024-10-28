// src/components/api.js
import axios from 'axios' // Make sure axios is imported

const API_BASE_URL = 'http://localhost:5000' // Replace with your actual API base URL

// api.js
// api.js
export const fetchTodos = async () => {
  const response = await fetch('/api/todos') // Adjust the URL based on your API route
  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }
  return await response.json()
}

export const createTodo = async todo => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  })
  if (!response.ok) {
    throw new Error('Failed to create todo')
  }
  return await response.json()
}

export const updateTodo = async (id, updatedData) => {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  if (!response.ok) {
    throw new Error('Failed to update todo')
  }
  return await response.json()
}
