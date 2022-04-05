const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const router = new Router()
const { body } = require('express-validator')


router.post('/sign-up',
    body('username', 'Имя пользователя не может быть пустым').notEmpty(),
    body('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({ min: 4, max: 10 }),
    userController.registration)
router.post('/sign-in', userController.login)
router.post('/sign-out', userController.logout)
router.get('/refresh', userController.refresh)
router.post('/deleteacc', userController.deleteAcc)


module.exports = router