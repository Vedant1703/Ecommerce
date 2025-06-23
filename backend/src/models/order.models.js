import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, "Total amount must be a positive number"],
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export { Order };