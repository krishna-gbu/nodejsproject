const router = require('express').Router()
const adminAuthController = require('../controller/adminAuthController')
const admnController  = require('../controller/adminController')

router.route('/signup').post(adminAuthController.sigup)
router.route('/login').post(adminAuthController.login)
router.route('/me').get(adminAuthController.protect,admnController.me)
router.route('/getusers').get(adminAuthController.protect,admnController.getAllUsers)
router.route('/deleteuser').delete(adminAuthController.protect,admnController.deleteUser)

module.exports = router;