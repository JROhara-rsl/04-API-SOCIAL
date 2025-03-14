const ENV = require('../config/env');
const bcrypt    = require('bcrypt')
const jwt      = require('jsonwebtoken')
const createError = require('../middleware/error')

// Model
const Users     = require('../models/user.model');
const Posts     = require('../models/post.model')
const Messages  = require('../models/message.model')


const login = async (req, res, next) => {
    try {
        // Vérifier si le mail de l'utilisateur existe
        const user = await Users.findOne({email: req.body.email});
        if(!user) return next(createError(404, "User not found"));

        // Vérifier si le mdp correspond bien au mdp existant
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if(!comparePassword) return next(createError(400, "Wrong password !"))
        
        // Authentification réussi : 
        // Générer un token 
        const token = jwt.sign(
            {   id: user._id    },
            ENV.TOKEN,
            {   expiresIn: "24h"    }
        )

        // Déstructuration de l'user 
        // pour tout récupérer sauf le mdp
        const { password, ...others } = user._doc
        
        // On renvoie la res JSON en deux étapes : 
        // 1 - Ajout du token dans les cookies
        // 2 - Statut 200 - on renvoie l'user sans mdp
        res.cookie('access_token', token, { 
                httpOnly: true,
                maxAge: 24*60*60*1000, // 24 Heures
                secure: false,
                sameSite: 'strict',})
            .status(200).json({others})

    } catch(error) {
        next(createError(500, error.message))
    }
}

const updateUser = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté 
        if(!req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Vérifier si l'utilisateur existe
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))
            
        // Vérifier si l'utilisateur est authentifié
        if( user._id.toString() !== req.user.id.toString()) return next(createError(403, 'Accès refusé'))
        
        // Mettre à jour l'utilisateur avec le body de la request
        const response = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(response)
    } catch(error) {
        next(createError(500, error.message))
    }
}

const desactivateUser = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if(req.user || !req.user.id) return next(createError(401, 'Authentification requise'))
        
        // Trouer si l'utilsiateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))
        
        // Vérifier si l'utilisateur est authentifié
        if(user._id.toSring() !== req.user.id.toString()) return next(createError(403, 'Access denied'))
    } catch(error) {

    }
}

module.exports = {
    login,
    updateUser,

}