import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
    id: number;
    id_user: number;
    review: string;
    rating: number;
}

export interface IBarang extends Document {
    id: string;
    nama: string;
    image: string;
    deskripsi: string;
    id_jenis: number;
    stok: number;
    harga: number;
    id_user: number;
    reviews: IReview[];
    rating?: number; // Updated name for the virtual field
}

const ReviewSchema: Schema = new Schema(
    {
        id: { type: Number, required: true },
        id_user: { type: Number, required: true },
        review: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
    },
    {
        _id: false, // Disable _id for subdocuments
        versionKey: false,
    }
);

const BarangSchema: Schema = new Schema(
    {
        _id: { type: String, required: true },
        nama: { type: String, required: true },
        image: { type: String, required: true },
        deskripsi: { type: String, required: true },
        id_jenis: { type: Number, required: true },
        id_user: { type: Number, required: true },
        stok: { type: Number, required: true },
        harga: { type: Number, required: true },
        reviews: { type: [ReviewSchema], default: [] },
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

BarangSchema.virtual('id').get(function (this: { _id: string }) {
    return this._id;
});

BarangSchema.virtual('rating').get(function (this: IBarang) { // Renamed from 'averageRating' to 'rating'
    if (this.reviews.length === 0) return 0;
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / this.reviews.length;
});

export default mongoose.model<IBarang>('Barang', BarangSchema, 'Barang');