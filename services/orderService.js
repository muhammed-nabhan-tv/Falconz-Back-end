
// import mongoose from "mongoose";
// import Order from "../model/orderModel.js";
// import Cart from "../model/cartModel.js";
// import Product from "../model/productModel.js";
// import { AppError } from "../utils/errorHandler.js";

// export const createOrderService = async ({
//   userId,
//   source,
//   items,
//   shippingAddress,
//   paymentMethod = "COD",
// }) => {
//   if (!userId) throw new AppError("User required", 400);

//   if (
//     !shippingAddress?.address ||
//     !shippingAddress?.city ||
//     !shippingAddress?.pincode
//   ) {
//     throw new AppError("Shipping address incomplete", 400);
//   }

//   let finalItems = [];

//   // 🛒 MODE A: FROM CART (Aggregation)
//   if (source === "cart") {
//     const objectUserId = new mongoose.Types.ObjectId(userId);

//     const cartItems = await Cart.aggregate([
//       { $match: { userId: objectUserId } },

//       { $unwind: "$items" },

//       {
//         $lookup: {
//           from: "products", // collection name in MongoDB (lowercase plural usually)
//           localField: "items.productId",
//           foreignField: "_id",
//           as: "product",
//         },
//       },

//       { $unwind: "$product" },

//       {
//         $project: {
//           productId: "$product._id",
//           name: "$product.name",
//           price: "$product.price",
//           quantity: "$items.quantity",
//         },
//       },
//     ]);

//     if (!cartItems.length) {
//       throw new AppError("Cart is empty", 400);
//     }

//     finalItems = cartItems;

//     // 🔥 Clear cart using query (not JS)
//     await Cart.updateOne(
//       { userId: objectUserId },
//       { $set: { items: [] } }
//     );
//   }

//   // ⚡ MODE B: BUY NOW
//   else if (source === "buyNow") {
//     if (!items || items.length === 0) {
//       throw new AppError("No items provided", 400);
//     }

//     // Fetch all products in one query (optimized)
//     const productIds = items.map((i) => i.productId);

//     const products = await Product.find({
//       _id: { $in: productIds },
//     });

//     if (!products.length) {
//       throw new AppError("Products not found", 404);
//     }

//     // Map products → order items
//     finalItems = products.map((product) => {
//       const matchedItem = items.find(
//         (i) => i.productId.toString() === product._id.toString()
//       );

//       return {
//         productId: product._id,
//         name: product.name,
//         price: product.price,
//         quantity: matchedItem?.quantity || 1,
//       };
//     });
//   }

//   else {
//     throw new AppError("Invalid source", 400);
//   }

//   // 💰 TOTAL (still JS — aggregation alternative below)
//   const totalAmount = finalItems.reduce(
//     (sum, it) => sum + it.price * it.quantity,
//     0
//   );
// console.log(finalItems)
//   const order = await Order.create({
//     userId,
//     items: finalItems,
//     totalAmount,
//     shippingAddress,
//     paymentMethod,
//     status: "pending",
//   });

//   return order;
// };


import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import Cart from "../model/cartModel.js";
import { AppError } from "../utils/errorHandler.js";

export const createOrderService = async ({
    userId,
    items,
    shippingAddress,
    paymentMethod = "COD",
    clearCart = false,
}) => {

    if (!userId) {
        throw new AppError("User required", 400);
    }
    if (!shippingAddress) {
        throw new AppError("complete shipping details", 400)
    }

    if (!items || items.length === 0) {
        throw new AppError("No items provided", 400);
    }

    //  get all product ids
    const productIds = items.map((item) => item.productId);

    //  fetch products
    const products = await Product.find({
        _id: { $in: productIds },
    });

    if (!products.length) {
        throw new AppError("Products not found", 404);
    }

    //  create final items
    const finalItems = products.map((product) => {

        const matchedItem = items.find(
            (i) =>
                i.productId.toString() ===
                product._id.toString()
        );

        return {
            productId: product._id,
            name: product.name,
            category: product.category,
            img: product.img,
            price: product.price,
            quantity: matchedItem?.quantity || 1,
        };
    });

    //  total
    const totalAmount = finalItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 📦 create order
    const order = await Order.create({
        userId,
        items: finalItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: "pending",
    });

    // 🛒optional cart clear
    if (clearCart) {
        await Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        );
    }

    return order;
};

export const getUserOrdersService = async (userId) => {
    return await Order.find({ userId }).sort({
        createdAt: -1,
    });
};

export const getAllUserOrderService = async () => {
    return await Order.find().populate("userId", "firstName lastName email").sort({createdAt: -1 });
}

export const updateOrderStatusService = async (orderId, status) => {
    if (!orderId) throw new AppError("orderId required", 400)

    const order = Order.findByIdAndUpdate(
        orderId,
        { status }, {
        new: true,
        runValidators: true,
    })

    if (!order) throw new AppError("order not found", 404)

    return order
}