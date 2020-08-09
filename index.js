const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('req-body', (req, res) => JSON.stringify(req.body))

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
)

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = persons.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const { body } = req
  const { name, number } = body

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  if (persons.map(person => person.name).includes(name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name,
    number,
    id: Math.floor(Math.random() * Math.floor(100000))
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people
  <br />
  ${new Date(Date.now()).toString()}
  </p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
