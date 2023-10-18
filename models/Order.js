const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        desc: {
          type: String
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true
        },
      },
    ],
    amount: {
      type: Number,
      required: true
    },
    stripeId: { type: String, required: true},
    // address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);