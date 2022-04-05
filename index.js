require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const routerAuth = require('./router/auth')
const routerPost = require('./router/post')
const routerImg = require('./router/img')
const routerUser = require('./router/user')
const errorMiddleware = require('./middlewares/error-middleware')



const PORT = process.env.PORT || 7000
const HOST = process.env.HOST || '127.0.0.1'

const app = express()

app.use(express.json({ extended: true }))
app.use(express.urlencoded({extended: false}))
app.use(express.static('uploads'))
app.use(cookieParser())
app.use(cors())
app.use('/api/auth', routerAuth)
app.use('/api/posts', routerPost)
app.use('/api/img', routerImg)
app.use('/api/user', routerUser)

app.use(errorMiddleware)


async function start() {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, HOST, () => {
            console.log(`Server listens http://${HOST}:${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

