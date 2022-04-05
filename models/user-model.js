const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [{type: Schema.Types.ObjectId, ref: 'todos'}],
    images: [{type: Schema.Types.ObjectId, ref: 'uploads'}]

}, { _id: true})

module.exports = model('User', UserSchema)