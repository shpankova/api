const UploadModel = require('../models/img-model');
const ImgAccessModel = require('../models/img-access-model');
const imgService = require('../service/img-service');
const mongoose = require('mongoose')





class ImgController {

    async getAllImagesByUserId(req, res, next) {
        try {
            const currentUser = req.user.id;
            const userId = req.params.userId;
            const accessImgList = await ImgAccessModel.find({ userId: userId });
            const imgIdsWithAccessForCurrentUser = accessImgList.reduce((acc, { _id, imgId, blackListUserIds, userId }) => {
                if (blackListUserIds.includes(currentUser)) {
                    return acc;
                }
                acc.push(imgId);
                return acc;
            }, [])

            const images = await UploadModel.find({ _id: { $in: imgIdsWithAccessForCurrentUser } })

            return res.json(images);
        } catch (e) {
            next(e);
        }
    }

    async getAllImages(req, res, next) {
        try {
            const images = await UploadModel.find({ userId: req.user.id });
            return res.json(images);
        } catch (e) {
            next(e);
        }
    }

    async getImageById(req, res, next) {
        try {
            const imgId = req.params.imgId
            const image = await UploadModel.findOne({ _id: imgId });
            return res.json(image);
        } catch (e) {
            next(e);
        }
    }

    async denyAccess(req, res, next) {
        try {
            const imgId = req.params.imgId
            const { banUserIds } = req.body
            const imgAccessDeny = await imgService.denyAccess(imgId, banUserIds);
            return res.json(imgAccessDeny);
        } catch (e) {
            next(e);
        }
    }

    async allowAccess(req, res, next) {
        try {
            const imgId = req.params.imgId
            const { unBanUserIds } = req.body
            const imgAccessDeny = await imgService.allowAccess(imgId, unBanUserIds);
            return res.json(imgAccessDeny);
        } catch (e) {
            next(e);
        }
    }


    async uploads(req, res, next) {
        try {
            const file = req.file

            if (!file) {
                const error = new Error('Please choose files')
                error.httpStatusCode = 400
                return next(error);
            }

            const finalImg = await UploadModel.create({ filename: file.originalname, image: req.file.path, userId: req.user.id, _id: mongoose.Types.ObjectId() })
            await finalImg.save()

            const imgAccess = await ImgAccessModel.create({ userId: req.user.id, _id: mongoose.Types.ObjectId(), imgId: finalImg._id })
            await imgAccess.save()

            return res.json({ finalImg, imgAccess })
        } catch (e) {
            next(e);
        }

    }

    async deleteImg(req, res, next) {
        try {
            const imgId = req.params.imgId
            const deleteImg = await UploadModel.deleteOne({ _id: imgId, userId: req.user.id })
            return res.json(deleteImg)
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new ImgController();


