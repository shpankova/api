const {Schema, model} = require('mongoose')

const imgAccessSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId
    },
    imgId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blackListUserIds: [{
        default: [],
        type: Schema.Types.ObjectId,
    }],
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }

}, { _id: true})

module.exports = model('imgaccess', imgAccessSchema)