const express = require('express')
const router = express.Router()
const { verifyTokenAdmin } = require('../../middleware/verify')
const adminController = require('../../controllers/adminController')
const uploadFile = require('../../middleware/upload')

router.post('/', adminController.createAdminAcc)

router.put('/:id', verifyTokenAdmin, uploadFile, adminController.updateAdmin)

router.post('/login', adminController.login)

router.post('/refresToken', adminController.refreshToken)

router.post('/logout', adminController.logOut)

module.exports = router
