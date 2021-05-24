import fetch from 'node-fetch'
import { createClient } from './client'

const call = async (input: string) => {
  return fetch('http://localhost:3000/api', {
    method: 'POST',
    body: JSON.stringify({ input }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.text()
  })
}

const client = createClient(call)

client.getTodos({ id: 'foo' }).then(console.log)
