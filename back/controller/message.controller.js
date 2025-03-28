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

        // Vérifier que le destinataire existe
        // et est différent de l'user
        const receiver = await Users.findById(req.body.receiver);
        if(!receiver || receiver._id.toString() === userBody._id.toString()) return next(createError(400, 'Bad request'))

        // Créer un message à partir du body de la requête
        const theMessage = await Messages.create(req.body);

        // Récupérer l'user dans le body 
        // Insérer le message dans le tableau messages de l'user
        await Users.findByIdAndUpdate(req.body.user,
            { 
                $push: {     message: theMessage._id     }
            }, { new: true }
        )

        // Récupérer le receiver dans le body 
        // Insérer le message dans le tableau messages du receiver
        await Users.findByIdAndUpdate(req.body.receiver,
            { 
                $push: {     message: theMessage._id     }
            }, { new: true }
        )
        res.status(201).json({message: 'Message created', theMessage})
    } catch(error) {
        next(createError(500, error.message))
    }
}

const getAllMessage = async (req, res, next) => {
    try {
        verifyAdmin(req, res, next);

        const response = await Messages.find();
        res.status(200).json(response)
    } catch(error) {
        next(createError(500, error.message))
    }
}

const getMessageByUser = async (req, res, next) => {
    try {        
        // Vérifier si l'utilisateur est connecté
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
            
        // Trouver l'utilisateur connecté
        const userToken = await Users.findById(req.user.id);
        if(!userToken) return next(createError(404, 'User not found'))
            
        // Trouver si l'utilisateur existe 
        const receiver = await Users.findById(req.params.id);
        if(!receiver) return next(createError(404, 'Receiver not found'))
            
        const message = await Messages.find(  { 
            $or:[  
                {'user': userToken._id, 'receiver': receiver._id}, 
                {'user': receiver._id, 'receiver': userToken._id}  
            ]   
        });

        res.status(200).json({message})
    } catch(error) {
        next(createError(500, error.message))
    }
}

const updateMessage = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Trouver l'utilisateur connecté
        const userToken = await Users.findById(req.user.id);
        if(!userToken) return next(createError(404, 'User not found'))
            
        // Trouver le message par l'ID
        const userMessage = await Messages.findById(req.params.id);
        if(!userMessage) return next(createError(404, 'User not found'))
        
        // Vérifier si l'utilisateur est authentifié
        if( userToken._id.toString() !== userMessage.user.toString()) {
            return next(createError(403, 'Access denied'))
        }

        const response = await Messages.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!response) return next(createError(404, 'Message not tound !'))
        res.status(201).json(response)
    } catch(error) {
        next(createError(500, error.message))
    }
}

const desactivateMessage = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Trouver l'utilisateur connecté
        const userToken = await Users.findById(req.user.id);
        if(!userToken) return next(createError(404, 'User not found'))
            
        // Trouver le message par l'ID
        const userMessage = await Messages.findById(req.params.id);
        if(!userMessage) return next(createError(404, 'User not found'))
        
        // Vérifier si l'utilisateur est authentifié
        if( userToken._id.toString() !== userMessage.user.toString()) {
            return next(createError(403, 'Access denied'))
        }

        // Mettre à jour l'état activé du post
        const messageDesactivated = await Messages.findByIdAndUpdate(
            req.params.id, 
            {isActive: false}, 
            {new: true}
        );
        res.status(200).json({message: "Message désactivé", messageDesactivated})

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
    getMessageByUser,
    desactivateMessage,
    updateMessage,
}