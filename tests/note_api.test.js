const mongoose = require('mongoose')
const { initialNotes, notesInDb, usersInDb, api } = require('./test_helper')
const Note = require('../models/note')


beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})



test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')
  
    expect(response.body).toHaveLength(initialNotes.length)
  })
  
  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
  
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
    'Browser can execute only Javascript'
  )
  })

  test('a valid note can be added', async () => {
    
    const users = await usersInDb()
    
    expect(users).toHaveLength(1)
    expect(users[0].username).toBe("root")
   //console.log(users[0]._id)

    const newNote = {
      "content": 'async/await simplifies making async calls',
      "important": true,      
      "userid": users[0]._id
    }
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
      const notesAtEnd = await notesInDb()
      expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
    
      const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })
  test('note without content is not added', async () => {
    const users = await usersInDb()
    const newNote = {
      important: true,
      "userid": users[0]._id
    }
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
  
      const notesAtEnd = await notesInDb()

      expect(notesAtEnd).toHaveLength(initialNotes.length)
  })

  test('a specific note can be viewed', async () => {
    const notesAtStart = await notesInDb()
  
    const noteToView = notesAtStart[0]
  
    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  
    expect(resultNote.body).toEqual(processedNoteToView)
  })
  
  test('a note can be deleted', async () => {
    const notesAtStart = await notesInDb()
    const noteToDelete = notesAtStart[0]
  
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
  
    const notesAtEnd = await notesInDb()
  
    expect(notesAtEnd).toHaveLength(
      initialNotes.length - 1
    )
  
    const contents = notesAtEnd.map(r => r.content)
  
    expect(contents).not.toContain(noteToDelete.content)
  })

  afterAll(() => {
    mongoose.connection.close()
    //server.close()
  })