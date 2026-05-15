
import mongoose from "mongoose";
import { AppError } from "../utils/errorHandler.js";
import Cart from "../model/cartModel.js";
import Product from "../model/productModel.js";

// adding to cart 
export const addToCartService = async (userId, productId, quantity) => {
  if (!userId || !productId || !quantity) {
    throw new AppError("All Fields Are Required", 400);
  }

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not Found", 404);

  // 🔥 Try updating existing item
  const updatedCart = await Cart.findOneAndUpdate(
    { userId, "items.productId": productId },
    { $inc: { "items.$.quantity": quantity } },
    { new: true }
  );

  // 🔥 If item not found → push new
  if (!updatedCart) {
    return await Cart.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: { productId, quantity },
        },
      },
      { new: true, upsert: true }
    );
  }

  return updatedCart;
};

export const getUserCartService = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) return { items: [] };
  return cart;
};

// remove each product from cart
export const removeCartItemService = async (userId, productId) => {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid productId", 400);
  }

  const cart = await Cart.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },
    },
    { new: true }
  );

  if (!cart) return { items: [] };

  return cart;
};

// clear the entire cart
export const clearCartService = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );
  if (!cart) return { items: [] };

  return cart;
};