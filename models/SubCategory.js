const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true},
    categories: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);