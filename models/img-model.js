const {Schema, model} = require('mongoose')

const uploadSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    filename : {
        type : String,
        unique : true,
        required: true
    },
    image : {
        type : String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        required: true
    }
}, { _id: true})

module.exports = UploadModel = model('uploads', uploadSchema);



