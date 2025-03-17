// importation du module express
const express = require('express');
// Création  d'un router express
const router = express.Router();
const verifyToken = require('../middleware/auth')

const UserControllerAdmin = require('../controller/userAdmin.controller')
const UserController = require('../controller/user.controller')


// Admin controller
router.post('/add', UserControllerAdmin.postUser)
router.get('/all', UserControllerAdmin.getAllUser)
router.delete('/delete/:id', verifyToken, UserControllerAdmin.deleteUser)
router.put('/activate/:id', verifyToken, UserControllerAdmin.activateUser)

// User controller
router.post('/login', UserController.login)
router.put('/update/:id', verifyToken, UserController.updateUser)
router.put('/desactivate/:id', verifyToken, UserController.desactivateUser)

module.exports = router;