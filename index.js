const express = require('express')
const app = express()
require('dotenv').config()  //para poder usar las variables de entorno
require('./data/mongo')

const Note = require('./models/Note')
const cors = require('cors')
const { request, response } = require('express')

app.use(cors())

//para poder crear una post.
app.use(express.json())




  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    Note.find({}).then( notes => {
        response.json(notes)
      }
    )
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if(note)
    {
        response.json(note)
    }else
    {
        response.status(404).end()
    }
})



app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/notes', (request, response) => {    
    const body = request.body
    if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
    
      const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
      }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  app.use((request, response)=>{
    response.status(404).json({
      error: 'Not Found'
    })
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  