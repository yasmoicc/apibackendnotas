const mongoose = require('mongoose')
const noteShcema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})
noteShcema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteShcema)



module.exports = Note