import express from "express";
import {
    getWishlist,
    addToWishlist,
    clearWishlist,
    removeFromWishlist
} from "../controller/wishlistController.js";
import userAuth from "../middlewares/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/",userAuth ,getWishlist);
wishlistRouter.post("/add",userAuth, addToWishlist);
wishlistRouter.delete("/:productId",userAuth, removeFromWishlist);
wishlistRouter.delete("/",userAuth, clearWishlist);

export default wishlistRouter