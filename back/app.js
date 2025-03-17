const express = require('express');
const connectMongoDB = require('./config/dbMongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const ENV = require('./config/env');
const app = express();

// IMPORT ROUTER
const userRouter = require('./router/user.router')
const postRouter = require('./router/post.router')
const messageRouter = require('./router/message.router')

// CONNEXION MONGO
connectMongoDB(ENV.MONGO_URI, ENV.DB_NAME)

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// URLS API PREFIX
app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/messages", messageRouter)

// MIDDLEWARES DE GESTION D'ERROR
app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Une erreur est survenue"
    const details = error.details || null;

    res.status(status).json({
        error: {
            status, 
            message,
            details
        }
    })
})

module.exports = app;