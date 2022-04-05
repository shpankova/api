const ImgModel = require('../models/img-model');
const ImgAccessModel = require('../models/img-access-model')


class ImgService {
    async denyAccess(imgId, banUserIds) {
        const denyAccess = ImgAccessModel.updateOne({ imgId: imgId}, { $addToSet: {blackListUserIds: banUserIds}})
        return denyAccess
    }
    
    async allowAccess(imgId, unBanUserIds) {
        const denyAccess = ImgAccessModel.updateOne({ imgId: imgId}, { $pull: {blackListUserIds: unBanUserIds}})
        return denyAccess
    }

}

module.exports = new ImgService();