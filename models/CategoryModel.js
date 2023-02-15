const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "default category description",
      image: { type: String, default: "/images/category1.jpg" },
      attrs: [{ key: { type: String }, value: [{type: String}] }],
    },
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: { type: String, required: true, unique: true },
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
