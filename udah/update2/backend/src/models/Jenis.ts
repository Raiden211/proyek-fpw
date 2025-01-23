import mongoose, { Schema, Document } from 'mongoose';

export interface IJenis extends Document {
    id: Number;
    nama: string;
}

const JenisSchema: Schema = new Schema(
    {
        _id: { type: Number, required: true },
        nama: { type: String, required: true },
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
)

JenisSchema.virtual('id').get(function (this: { _id: Number }) {
    return this._id;
});

export default mongoose.model<IJenis>('Jenis', JenisSchema, 'Jenis');