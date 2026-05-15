import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        category:String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
        enum: [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ],
      default: "pending",
    },
    shippingAddress: {
      address:  { type: String, required: true },
      city:     { type: String, required: true },
      pincode:  { type: String, required: true }, // ✅ String not Number — "560001" not 560001
      phone:    { type: String, required: true }, // ✅ String not Number — handles leading zeros & formatting
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);