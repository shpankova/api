const Router = require('express').Router;
const router = new Router()
const controller = require('../controllers/post-controller');
const authMiddleware = require('../middlewares/auth-middleware');


router.get('/allposts', authMiddleware, controller.getAllPosts)
router.get('/post/:postId', authMiddleware, controller.getPostById)
router.get('/allpost/:userId', authMiddleware, controller.getAllPostsByUserId)
router.put('/post/:postId/access/deny', authMiddleware, controller.denyAccess)
router.put('/post/:postId/access/allow', authMiddleware, controller.allowAccess)
router.post('/createpost', authMiddleware, controller.createPost)
router.delete('/deletepost/:postId', authMiddleware, controller.deletePost)
router.put('/updatepost/:postId', authMiddleware, controller.updatePost)

module.exports = router




