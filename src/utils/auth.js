const jwt = require('jsonwebtoken')

const generateAccessToken = (data) => {
  return jwt.sign({ data }, process.env.ACCESS_TOKEN, {
    expiresIn: '1m'
  })
}

const generateRefreshToken = (data) => {
  return jwt.sign({ data }, process.env.REFRESH_TOKEN, {
    expiresIn: '24h'
  })
}
module.exports = {
  generateAccessToken,
  generateRefreshToken
}
