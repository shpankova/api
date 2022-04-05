const Router = require('express').Router;
const UserModel = require('../models/user-model')
const TodoModel = require('../models/todo-model')
const ImgModel = require('../models/img-model')
const router = new Router()
const authMiddleware = require('../middlewares/auth-middleware')



router.get('/userme', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.id
        const todos = await TodoModel.find({ userId: userId })
        const images = await ImgModel.find({ userId: userId })
        const userUpdate = await UserModel.updateOne({ _id: userId }, { $addToSet: { todos: todos, images: images } })
        const user = await UserModel.findOne({ _id: userId }).populate('todos').populate('images')
        return res.json({ user, userUpdate });

    } catch (e) {
        next(e);
    }
})

module.exports = router