const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        title: {
            type: String, 
            minLenght: 3,
            maxLenght: 50,
            required: true,
        },
        content: {
            type: String, 
            minLenght: 3,
            maxLenght: 280,
            required: true
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
        },
        like: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true
        }],
        isActive: {
            type: Boolean,
            default: true,
        }
    }, {    timestamps: { createdAt: true   }}
)

module.exports = mongoose.model('Posts', postSchema)