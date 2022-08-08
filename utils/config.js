require('dotenv').config()

const PORT = process.env.PORT
let {MONGODB_URI, MONGODB_URI_TEST, NODE_ENV} = process.env
//const MONGODB_URI = process.env.MONGODB_URI
MONGODB_URI = (NODE_ENV === 'test')? MONGODB_URI_TEST:MONGODB_URI
module.exports = { 
  MONGODB_URI,
  PORT
}