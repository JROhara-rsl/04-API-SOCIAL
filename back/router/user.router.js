// importation du module express
const express = require('express');
// Création  d'un router express
const router = express.Router();
const verifyToken = require('../middleware/auth')

const UserControllerAdmlin = require('../controller/userAdmin.controller')
const UserController = require('../controller/user.controller')


// Admin controller
router.post('/add', UserControllerAdmlin.postUser)
router.get('/all', UserControllerAdmlin.getAllUser)
router.delete('/delete/:id', UserControllerAdmlin.deleteUser)

// User controller
router.post('/login', verifyToken, UserController.login)
router.put('/update/:id', verifyToken, UserController.updateUser)

module.exports = router;