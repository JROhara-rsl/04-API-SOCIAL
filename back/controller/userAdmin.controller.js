const ENV = require('../config/env');
const bcrypt    = require('bcrypt')
const jwt      = require('jsonwebtoken')
const createError = require('../middleware/error')

// Model
const Users     = require('../models/user.model');
const Posts     = require('../models/post.model')
const Messages  = require('../models/message.model')


const postUser = async (req, res, next) => {
    try {
        // Créer un mdp crypté à partir du password de la request
        const passwordHashed = await bcrypt.hash(req.body.password, 10);
        // Créer un user à partir du body de la request
        const user = await Users.create({
            ...req.body,
            password: passwordHashed
        });

        res.status(201).json({
            message: 'user created',
            user
        })
    } catch(error) {
        next(createError(500, error.message))
    }
}

const getAllUser = async(req, res, next) => {
    try {
        const result = await Users.find();
        if(result) res.status(200).json(result);
    } catch(error) {
        next(createError(500, error.message))
    }
}

const activateUser = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
    
        // Trouver l'utilisateur connecté
        const userToken = await Users.findById(req.user.id);
        if(!userToken) return next(createError(404, 'User not found'))

        // Trouver si l'utilisateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))

        // Vérifier si l'utilisateur est authentifié
        // Ou si l'utilisateur est admin
        if( userToken.role !== 'admin' &
            userToken.role !== 'superAdmin') {
                return next(createError(403, 'Access denied'))
        }    

        // Mettre à jour l'état activé de l'utilisateur
        await Users.findByIdAndUpdate(
            userToken.id, 
            {isActive: true}, 
            {new: true}
        );
        res.status(200).json("Compte de "+ user.username +" activé")
    } catch(error) {
        next(createError(500, error.message))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur actif est admin  
        if(req.user.role !== 'admin' || req.user.role !== 'superAdmin' ) {
            return next(createError(403, 'Acces refusé'))
        }
        
        // Trouvez si l'utilisateur existe 
        const userReq = await Users.findById(req.params.id);
        if(!userReq) return next(createError(404, 'User not found'))
                
        // Supprimer l'utilisateur de la base de donnée
        const checkUser = await Users.findByIdAndDelete(req.params.id);
        if(checkUser) return res.status(200).json('User delete');

    } catch(error) {
        next(createError(500, error.message))        
    }
}

module.exports = {
    postUser,
    getAllUser,
    activateUser,
    deleteUser,
}