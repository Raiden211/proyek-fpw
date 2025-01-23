import mongoose, { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  id_user: number;
  username: string;
  subtotal: number;
  payment_method: string;
  date_of_buy: string;
  barang: { id: string; jumlah: number; harga: number }[];
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    _id: { type: Number, required: true },
    id_user: { type: Number, required: true },
    username: { type: String, required: true },
    subtotal: { type: Number, required: true },
    payment_method: { type: String, required: true },
    date_of_buy: { type: String, required: true },
    barang: [
      {
        id: { type: String, required: true },
        jumlah: { type: Number, required: true },
        harga: { type: Number, required: true },
      },
    ],
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

TransactionSchema.virtual("id").get(function (this: { _id: number }) {
  return this._id;
});

export default mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema,
  "Transaction"
);
