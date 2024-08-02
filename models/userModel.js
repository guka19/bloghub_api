const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      required: true,
      default: "https://www.svgrepo.com/show/153727/profile-avatar.svg",
    },

    bio: {
      type: String,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    collection: "users",
    timestamps: true,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
    read: "nearest",
  }
);

const Model = mongoose.model("User", userSchema);

module.exports = Model;
