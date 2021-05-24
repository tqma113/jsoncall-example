import express from 'express'
import { json } from 'body-parser'
import { call } from '.'

const app = express()

app.use(json())

app.use('/api', (req, res) => {
  console.log(req.body)
  res.send(call(req.body.input))
})

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
