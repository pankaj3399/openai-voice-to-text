import { Schema, Types, model } from 'mongoose';

const feedbackSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'User id field is required']
    },
    feedback: {
        type: String,
        required: [true, 'feedback field is required'],
    },
}, { timestamps: true });

const Feedback = model("Feedback", feedbackSchema);
export default Feedback;