const mongoose = require('mongoose')

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('DATABASE connect success !!!')
  } catch (error) {
    console.log('DATABASE connect failed !!!', error)
  }
}

module.exports = connectDatabase
