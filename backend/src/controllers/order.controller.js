import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.models.js";

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { products, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    throw new ApiError(400, "No products provided for order");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) throw new ApiError(404, `Product with ID ${item.product} not found`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product ${product.name}`);
    }

    totalAmount += product.price * item.quantity;

    // Decrement product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    products,
    totalAmount,
    shippingAddress,
  });

  res.status(201).json(new ApiResponse("Order placed successfully", order));
});

// Get all orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "username fullName")
    .populate("products.product", "name price");

  res.status(200).json(new ApiResponse("All orders retrieved", orders));
});

// Get orders of current user
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("products.product", "name price");

  res.status(200).json(new ApiResponse("User orders retrieved", orders));
});

// Get single order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("user", "username fullName")
    .populate("products.product", "name price");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Optional: Check if user is owner
  if (!req.user.isAdmin && !order.user._id.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  res.status(200).json(new ApiResponse("Order retrieved", order));
});

// Update order status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  res.status(200).json(new ApiResponse("Order status updated", order));
});

// Delete order (admin or user cancel)
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check permission
  if (!req.user.isAdmin && !order.user.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this order");
  }

  await Order.findByIdAndDelete(orderId);

  res.status(200).json(new ApiResponse("Order deleted successfully"));
});

export {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
