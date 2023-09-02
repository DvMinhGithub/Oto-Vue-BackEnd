require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const connectDb = require('./configs/db')
const app = express()
connectDb()

app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', express.static('public'))
app.use(routes)

const { PORT } = process.env || 8080
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
