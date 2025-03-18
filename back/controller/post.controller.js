const ENV = require('../config/env');
const bcrypt    = require('bcrypt')
const jwt      = require('jsonwebtoken')
const createError = require('../middleware/error')
const verifyAdmin = require('../middleware/authAdmin')

// Model
const Users     = require('../models/user.model');
const Posts     = require('../models/post.model')
const Messages  = require('../models/message.model')

const getAllPosts = async (req, res, next) => {
    try {
        const response = await Posts.find();
        res.status(200).json(response)
    } catch(error) {
        next(createError(500, error.message))
    }
}

const post = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté 
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Vérifier si l'utilisateur existe
        const userBody = await Users.findById(req.body.user);
        if(!userBody) return next(createError(404, 'User not found'))
            
        // Vérifier si l'utilisateur est authentifié
        if( userBody._id.toString() !== req.user.id.toString()) return next(createError(403, 'Accès refusé'))
    
        // Créer un post à partir du body de la requête
        const post = await Posts.create(req.body);
    
        // Récupérer l'user dans le body 
        // Insérer le post dans le tableau posts de l'user
        await Users.findByIdAndUpdate(req.body.user,
            { 
                $push: { 
                  post: post._id 
                }
            }, { new: true }
        )
        res.status(201).json({message: 'Post created', post})
    } catch(error) {
        next(createError(500, error.message))
    }
}

const updatePost = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté 
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Vérifier si l'utilisateur existe
        const userIdBody = await Users.findById(req.body.user);
        if(!userIdBody) return next(createError(404, 'User not found'))
        
        // Vérifier si l'utilisateur est authentifié
        if( userIdBody._id.toString() !== req.user.id.toString()) return next(createError(403, 'Accès refusé'))

        const response = await Posts.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!response) return next(createError(404, 'Post not tound !'))
        res.status(200).json(response)
    } catch(error) {
        next(createError(500, error.message))
    }
}

const desactivatePost = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté 
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))

        // Trouver l'utilisateur connecté
        const userToken = await Users.findById(req.user.id);
        if(!userToken) return next(createError(404, 'User not found'))
            
        // Trouver le post
        const post = await Posts.findById(req.params.id);
        if(!post) return next(createError(404, 'Post not found'))
        
        // Vérifier si l'utilisateur est authentifié
        // Ou si l'utilisateur est admin
        if( userToken._id.toString() !== post.id.toString() &
            userToken.role === 'user') {
                return next(createError(403, 'Access denied'))
        }
        
        // Mettre à jour l'état activé du post
        const postDesactivated = await Posts.findByIdAndUpdate(
            req.params.id, 
            {isActive: false}, 
            {new: true}
        );
        res.status(200).json({message: "Post désactivé", postDesactivated})
    } catch(error) {
        next(createError(500, error.message))
    }
}

const deletePost = async (req, res, next) => {
    try {
        verifyAdmin(req, res, next);
                
        // Supprimer le post de la base de donnée
        const checkPost = await Posts.findByIdAndDelete(req.params.id);
        if(!checkPost) {
            return next(createError(404, 'Post not found'))
        } else {
            return res.status(200).json('Post delete');
        }
    } catch(error) {
        next(createError(500, error.message))        
    }
}

module.exports = {
    post,
    getAllPosts,
    updatePost,
    desactivatePost,
    deletePost,
}

