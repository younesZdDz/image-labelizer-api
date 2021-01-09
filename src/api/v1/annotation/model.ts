import mongoose from 'mongoose';

const { Schema } = mongoose;

const AnnotationSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    completed_at: Date,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    instruction: { type: String, required: true },
    response: {
        comment: String,
        annotations: [
            {
                left: Number,
                top: Number,
                width: Number,
                height: Number,
                label: String,
            },
        ],
    },
    params: {
        attachmentType: { type: String, enum: ['image'], default: 'image' },
        attachment: String,
        objectsToAnnotate: [String],
    },
});
export default mongoose.model('Annotation', AnnotationSchema);
