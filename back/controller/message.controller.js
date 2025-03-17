const ENV = require('../config/env');
const bcrypt    = require('bcrypt')
const jwt      = require('jsonwebtoken')
const createError = require('../middleware/error')
const verifyAdmin = require('../middleware/authAdmin')

// Model
const Users     = require('../models/user.model');
const Posts     = require('../models/post.model')
const Messages  = require('../models/message.model')

const postMessage = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté 
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Vérifier si l'utilisateur existe
        const userBody = await Users.findById(req.body.user);
        if(!userBody) return next(createError(404, 'User not found'))
        
        // Vérifier si l'utilisateur est authentifié
        if( userBody._id.toString() !== req.user.id.toString()) return next(createError(403, 'Accès refusé'))

        // Créer un message à partir du body de la requête
        const theMessage = await Messages.create(req.body);

        // Récupérer l'user dans le body 
        // Insérer le post dans le tableau posts de l'user
        const user = await Users.findByIdAndUpdate(req.body.user,
            { 
                $push: { 
                    message: theMessage._id 
                }
            }, { new: true }
        )
        res.status(201).json({message: 'Message created', theMessage})
    } catch(error) {
        next(createError(500, error.message))
    }
}

const getAllMessage = async (req, res, next) => {
    try {
        const response = await Messages.find();
        res.status(200).json(response)
    } catch(error) {
        next(createError(500, error.message))
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        verifyAdmin(req, res, next);
                
        // Supprimer le post de la base de donnée
        const checkMessage = await Messages.findByIdAndDelete(req.params.id);
        if(!checkMessage) {
            return next(createError(404, 'Message not found'))
        } else {
            return res.status(200).json('Message delete');
        }
    } catch(error) {
        next(createError(500, error.message))
    }
}

module.exports = {
    postMessage,
    getAllMessage,
    deleteMessage,
}