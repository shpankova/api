const Router = require('express').Router;
const router = new Router()
const controller = require('../controllers/img-controller');
const store = require('../middlewares/multer')
const authMiddleware = require('../middlewares/auth-middleware');


router.get('/allimg', authMiddleware, controller.getAllImages)
router.get('/img/:imgId', authMiddleware, controller.getImageById)
router.get('/allimg/:userId', authMiddleware, controller.getAllImagesByUserId)
router.put('/img/:imgId/access/deny', authMiddleware, controller.denyAccess)
router.put('/img/:imgId/access/allow', authMiddleware, controller.allowAccess)
router.post('/upload', authMiddleware, store.single('images') , controller.uploads)
router.delete('/deleteimg/:imgId', authMiddleware, controller.deleteImg)


module.exports = router;