import mongoose from "mongoose";
import { AppError } from "../utils/errorHandler.js";
import Cart from "../model/cartModel.js";
import Product from "../model/productModel.js"

export const addToCartService = async (userId, productId, quantity) => {
    if (!userId || !productId || !quantity) {
        throw new AppError("All Fields Are Required", 400)
    }

    const product = await Product.findById(productId)
    if (!product) throw new AppError("Product not Found", 404)


    let cart = await Cart.findOne({ userId })

    if (!cart) {
        cart = new Cart({ userId, items: [{ productId, quantity }] });

    } else {
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({ productId, quantity })
        }
    }
    await cart.save()
    return cart;
}