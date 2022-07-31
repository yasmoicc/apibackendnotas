const mongoose = require('mongoose')


const url = process.env.MONGODB_URI

mongoose.connect(url).then(
  () => {
    console.log('Database Connected')
  }
).catch(erro => {
  console.error('Some problems');
})



