import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    id_barang: string;
    jumlah: number;
    total: number;
}

export interface ICart extends Document {
    id: number;
    id_user: number;
    cart: ICartItem[];
    subtotal: number;
}

const CartItemSchema: Schema = new Schema<ICartItem>(
    {
        id_barang: { 
            type: String, 
            required: true 
        },
        jumlah: { 
            type: Number, 
            required: true 
        },
        total: { 
            type: Number, 
            required: true 
        },
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

const CartSchema: Schema = new Schema<ICart>(
    {
        _id: { 
            type: Number, 
            required: true 
        },
        id_user: { 
            type: Number, 
            required: true 
        },
        cart: { 
            type: [CartItemSchema],
            required: true,
        },
        subtotal: { 
            type: Number, 
            required: true 
        },
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

CartSchema.virtual('id').get(function (this: { _id: Number }) {
    return this._id;
});

export default mongoose.model<ICart>('Cart', CartSchema, 'Cart');