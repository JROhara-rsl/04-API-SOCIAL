const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
    {
        message: {
            type: String,
            minLenght: 1,
            maxLenght: 500,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        isActive: {
            type: Boolean, 
            default: true,
        }
    }, {    timestamps: { createdAt: true   }}
)

module.export = mongoose.model('Messages', messageSchema)