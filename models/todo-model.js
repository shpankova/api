const {Schema, model} = require('mongoose')

const TodoSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        required: true
    }
}, { _id: true})

module.exports = model('todos', TodoSchema)