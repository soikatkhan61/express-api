const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    phone: {type: String},
    isAdmin: {type: Boolean, default: false,},
    verifytoken: {type: String,},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);