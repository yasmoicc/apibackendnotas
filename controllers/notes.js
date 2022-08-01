const notesRouter = require('express').Router()
const Note = require('../models/note')


  
  notesRouter.get('/', (request, response) => {
    Note.find({}).then( notes => {
        response.json(notes)
      }
    )
  })

  notesRouter.get('/:id', (request, response, next) => {
    
    const id = request.params.id    
    Note.findById(id)
    .then(note =>{
      if(note)
        response.json(note)
      else
        response.status(404).end()
    })
    .catch(error => next(error))    
})

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  }) 
  
  notesRouter.post('/', (request, response, next) => {    
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
      note.save()
      .then(saveNote => {
          response.json(saveNote.toJSON())
        }
      )
      .catch(error => next(error))
    
  })
  notesRouter.put('/:id', (request, response, next) => {
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

  module.exports = notesRouter