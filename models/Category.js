const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    img: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);