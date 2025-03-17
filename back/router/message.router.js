// importation du module express
const express = require('express');
// Création  d'un router express
const router = express.Router();
const verifyToken = require('../middleware/auth')

const MessageController = require('../controller/message.controller')

router.get('/getAll', MessageController.postMessage)
router.post('/post', verifyToken, MessageController.postMessage)
router.delete('/delete/:id', verifyToken, MessageController.deleteMessage)

module.exports = router;