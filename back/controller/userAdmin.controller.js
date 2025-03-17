const ENV = require('../config/env');
const bcrypt    = require('bcrypt')
const jwt      = require('jsonwebtoken')
const createError = require('../middleware/error')
const verifyAdmin = require('../middleware/authAdmin')

// Model
const Users     = require('../models/user.model');
const Posts     = require('../models/post.model')
const Messages  = require('../models/message.model')

const activateUser = async (req, res, next) => {
    try {
        verifyAdmin(req, res, next);

        // Trouver si l'utilisateur existe 
        const user = await Users.findById(req.params.id);
        if(!user) return next(createError(404, 'User not found'))

        // Mettre à jour l'état activé de l'utilisateur
        await Users.findByIdAndUpdate(
            user.id, 
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
        verifyAdmin(req, res, next);
        
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
    activateUser,
    deleteUser,
}