import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.models.js";
import fs from "fs/promises";


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

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  const product = await Product.findById(productId).populate("createdBy", "username fullName");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json(new ApiResponse("Product retrieved successfully", product));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, stock, description, category } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (name) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (description) product.description = description;
  if (category) product.category = category;

  await product.save();

  res.status(200).json(new ApiResponse("Product updated successfully", product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse("Product deleted successfully", product));
});



export {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct};