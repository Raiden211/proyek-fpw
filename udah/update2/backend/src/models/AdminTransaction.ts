import mongoose, { Schema, model, Document } from "mongoose";

export interface IAdminTransaction extends Document {
  id_admin: number;
  barang: {
    id: string;
    nama: string;
    image: string;
    deskripsi: string;
    jumlah_beli: number;
    total: number;
  }[];
  users: {
    first_name: string;
    last_name: string;
    email: string;
  }[];
  subtotal: number;
  pay_method: string;
  date_of_buy: string;
}

const AdminTransactionSchema: Schema<IAdminTransaction> = new Schema(
  {
    _id: { type: Number, required: true },
    id_admin: { type: Number, required: true },
    barang: [
      {
        id: { type: String, required: true },
        nama: { type: String, required: true },
        image: { type: String, required: true },
        deskripsi: { type: String, required: true },
        jumlah_beli: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    users: [
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    pay_method: { type: String, required: true },
    date_of_buy: { type: String, required: true },
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

AdminTransactionSchema.virtual("id").get(function (this: { _id: number }) {
  return this._id;
});

export default mongoose.model<IAdminTransaction>(
  "AdminTransaction",
  AdminTransactionSchema,
  "AdminTransaction"
);
