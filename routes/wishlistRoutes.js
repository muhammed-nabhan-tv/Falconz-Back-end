import express from "express";
import {
    getWishlist,
    addToWishlist,
    clearWishlist,
    removeFromWishlist
} from "../controller/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/", getWishlist);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.delete("/:productId", removeFromWishlist);
wishlistRouter.delete("/", clearWishlist);

export default wishlistRouter