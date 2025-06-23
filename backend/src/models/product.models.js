import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock must be a positive number"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min:[0, "Price must be a positive number"],
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
}, { timestamps: true });

productSchema.methods.isPriceValid = function () {
  return this.price > 0;
};
const Product = mongoose.model("Product", productSchema);




export { Product };