import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    uId: {type: String, required: true},
    username: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default model<User>('Users', userSchema);