import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnotation extends Document {
    createdAt: Date;
    status: 'pending' | 'completed';
    instruction: string;
    response: {
        comment: string;
        annotations: {
            left: number;
            top: number;
            width: number;
            height: number;
            label: string;
        }[];
    };
    params: {
        attachmentType: 'image';
        attachment: string;
        objectsToAnnotate: string[];
    };
}

const AnnotationSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
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
export default mongoose.model<IAnnotation>('Annotation', AnnotationSchema);
