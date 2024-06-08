const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  thumbnail: String,
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;