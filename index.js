const express = require('express')
const app = express()
require('dotenv').config()  //para poder usar las variables de entorno
require('./data/mongo')

const Note = require('./models/Note')
const cors = require('cors')
const { request, response } = require('express')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
//app.use(logger)



  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    Note.find({}).then( notes => {
        response.json(notes)
      }
    )
  })

  app.get('/api/notes/:id', (request, response, next) => {
    
    const id = request.params.id
    console.log(id)
    Note.findById(id)
    .then(note =>{
      if(note)
        response.json(note)
      else
        response.status(404).end()
    })
    .catch(error => next(error))    
})



app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

      const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()        
      })
      note.save().then(saveNote => {
          response.json(saveNote)
        }
      )
    
  })
  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

  app.use((request, response)=>{
    response.status(404).json({
      error: 'Not Found'
    })
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  