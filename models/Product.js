const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true, },
        img: { type: String, required: true },
        img2: { type: String, required: true },
        size: { type: Array },
        color: { type: Array },
        price: { type: Number, required: true },
        type: { type: String, default: "normal" },
        categories: { type: String },
        subCategories: { type: String },
        isUpdated: { type: Boolean, default: false },
        inStock: { type: Boolean, default: true },
        availableProduct: { type: Number, default: 10 },
        totalStars: {
            type: Number,
            default: 0,
        },
        starNumber: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);