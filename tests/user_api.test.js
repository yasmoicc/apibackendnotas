const bcrypt = require('bcrypt')
const User = require('../models/User')
const {initialNotes, nonExistingId, notesInDb, usersInDb, api} = require('./test_helper')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('verificar que un username no se repita', async () =>{
    
    const users = await usersInDb()

    const newUser = {
      username: users[0].username,
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
    .post('/api/users/')
    .send(newUser)
    .expect(400)

    const usersafter = await usersInDb()
    expect(usersafter).toHaveLength(users.length)    
  })
})