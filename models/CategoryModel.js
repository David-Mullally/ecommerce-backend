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
    },
    image: { type: String, default: "/images/category1.jpg" },
    attrs: [{ key: { type: String }, value: [{ type: String }] }],
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ description: 1 });
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
