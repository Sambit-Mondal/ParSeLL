import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';
import UserSchema from '../models/users';

// Mongoose schema
const mongooseUserSchema = new Schema({
    username: { type: String, required: true, maxlength: 10 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 5 },
    phone: { type: String, required: true, length: 10 },
    role: { type: String, required: true, enum: ['Seller', 'Buyer'] },
    address: { type: String },
});

interface IUser extends Document, z.infer<typeof UserSchema> { }

// Mongoose model
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', mongooseUserSchema);

export { UserModel };