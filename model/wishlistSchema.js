import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ FIXED FIELD
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [], // ✅ VERY IMPORTANT
    },
  },
  { timestamps: true } // ✅ FIXED
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;