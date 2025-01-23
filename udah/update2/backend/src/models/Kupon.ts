import mongoose, { Schema, model, Document } from 'mongoose';

export interface IKupon extends Document {
  id: number;
  nama: string;
  diskon: number;
  min_pembelian: number;
  exp_date: string;
  pengguna: number[];
}

const KuponSchema: Schema<IKupon> = new Schema(
  {
        _id: { type: Number, required: true },
        nama: { type: String, required: true },
        diskon: { type: Number, required: true },
        min_pembelian: { type: Number, required: true },
        exp_date: { type: String, required: true },
        pengguna: [{ type: Number, required: true }],
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

KuponSchema.virtual('id').get(function (this: { _id: number }) {
    return this._id;
});

export default mongoose.model<IKupon>('Kupon', KuponSchema, 'Kupon');