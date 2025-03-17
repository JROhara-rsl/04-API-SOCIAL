// importation du module express
const express = require('express');
// Création  d'un router express
const router = express.Router();
const verifyToken = require('../middleware/auth')

const UserControllerAdmin = require('../controller/userAdmin.controller')
const UserController = require('../controller/user.controller')

// User controller
router.get('/all', UserController.getAllUser)
router.post('/add', UserController.postUser)
router.post('/login', UserController.login)
router.put('/update/:id', verifyToken, UserController.updateUser)
router.put('/desactivate/:id', verifyToken, UserController.desactivateUser)

// Admin controller
router.delete('/delete/:id', verifyToken, UserControllerAdmin.deleteUser)
router.put('/activate/:id', verifyToken, UserControllerAdmin.activateUser)

module.exports = router;