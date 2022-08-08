const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/User')


  
  notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.status(200).json(notes)
      
    
  })

  notesRouter.get('/:id', (request, response, next) => {
    
    const id = request.params.id    
    Note.findById(id)
    .then(note =>{
      if(note)
        response.status(201).json(note)
      else
        response.status(404).end()
    })
    .catch(error => next(error))    
})

notesRouter.delete('/:id', async (request, response, next) => {
   
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
}) 
  
  notesRouter.post('/', async (request, response, next) => {    
    const {content, important, userid} = request.body    
      //console.log(request.body)
      const userBD = await User.findById(userid)
      const note = new Note({
        content,
        important,
        date: new Date(),
        user: userBD._id       
      })      
       
      try {
        const savednote = await note.save()
        userBD.notes =  userBD.notes.concat(savednote)
        await userBD.save()    
        response.json(savednote.toJSON())
      } catch (exception) {
        next(exception)
      }
    
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