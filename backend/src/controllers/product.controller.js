import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.models.js";


const updatestock = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.stock = quantity;
  await product.save();

  res.status(200).json(new ApiResponse("Stock updated successfully", product));
});


const createProduct = asyncHandler(async (req, res) => {
  const { name, price, stock, description,category } = req.body;

if (!name || price === undefined || stock === undefined || !description || !category) {
  throw new ApiError(400, "All fields (name, price, stock, description, category) are required");
}
if (price < 0 || stock < 0) {
  throw new ApiError(400, "Price and stock must be positive numbers");
}
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorised request");
  }
  if (!req.files || !req.files.image || req.files.image.length === 0)
  {
    throw new ApiError(400, "Product image is required");
  }

  const productImageLocalPath = req.files?.image[0]?.path;
  
  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }
  const productImage = await uploadOnCloudinary(productImageLocalPath);
  if (!productImage?.url) {
  await fs.unlink(productImageLocalPath); // Clean up
  throw new ApiError(400, "Product image upload failed");
  }

// After successful upload, delete the local file
await fs.unlink(productImageLocalPath);
  const newProduct = new Product({
    name,
    price,
    stock,
    description,
    category,
    imageUrl: productImage?.url || "", 
    createdBy: req.user._id,
  });
  await newProduct.save();

  res.status(201).json(new ApiResponse("Product created successfully", newProduct));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("createdBy", "username fullName");
  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }
  res.status(200).json(new ApiResponse("Products retrieved successfully", products));
});





















export {updatestock,createProduct,getAllProducts}