// importation du module express
const express = require('express');
// Création  d'un router express
const router = express.Router();
const verifyToken = require('../middleware/auth')

const PostController = require('../controller/post.controller')

router.get('/all', PostController.getAllPosts)
router.post('/post', verifyToken, PostController.post)
router.put('/update/:id', verifyToken, PostController.updatePost)
router.put('/desactivate/:id', verifyToken, PostController.desactivatePost)
router.delete('/delete/:id', verifyToken, PostController.deletePost)

module.exports = router;