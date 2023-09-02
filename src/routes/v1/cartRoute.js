const express = require('express')
const router = express.Router()

const { verifyTokenCustomer } = require('../../middleware/verify')
const cartController = require('#controllers/cartController')

// router.get('/:idCustomer', verifyTokenCustomer, cartController.getCartItems);

// router.post('/:idCustomer', verifyTokenCustomer, cartController.addToCart);

router.get('/:idCustomer', cartController.getCartItems)

router.post('/:idCustomer', cartController.addToCart)

router.put('/:idCustomer', verifyTokenCustomer, cartController.updateCart)

router.delete('/:idCustomer/:idProduct', verifyTokenCustomer, cartController.removeCart)

router.put('/reset/:idCustomer', verifyTokenCustomer, cartController.resetCart)

module.exports = router
