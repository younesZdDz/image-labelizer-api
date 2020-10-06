const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnnotationSchema = new Schema({
    created_at: {type: Date, default: Date.now},
    completed_at: Date,
    status: {type: String, enum:['pending', 'completed'], default:'pending'},
    instruction: {type: String, required: true},
    response: {
        comment: String,
        annotations:
            [{
                left: Number,
                top: Number,
                width: Number, 
                height: Number, 
                label: String
            }]
    },
    params: {
        attachment_type: {type: String, enum:['image'], default: 'image'},
        attachment: String,
        objects_to_annotate: [String],
    }
})
module.exports = mongoose.model('Annotation', AnnotationSchema);
