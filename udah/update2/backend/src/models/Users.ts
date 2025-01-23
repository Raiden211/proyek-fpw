import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    saldo: number;
    role: number;
}

const UsersSchema: Schema = new Schema(
    {
        _id: { type: Number, required: true },
        username: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        saldo: { type: Number, required: true },
        role: {type: Number, required: true}
    },
    {
        timestamps: false,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        versionKey: false,
    }
);

UsersSchema.virtual('id').get(function (this: { _id: number }) {
    return this._id;
});

export default mongoose.model<IUser>('Users', UsersSchema, 'Users');