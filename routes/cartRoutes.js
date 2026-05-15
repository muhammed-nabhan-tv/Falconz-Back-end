

import express from "express";
import {
  addToCart,
  getUserCart,
  removeCartItem,
  clearCart,
} from "../controller/cartController.js";
import userAuth from "../middlewares/auth.js";
 

const cartRouter = express.Router();
 
cartRouter.get("/",userAuth, getUserCart);
cartRouter.post("/add",userAuth, addToCart);
cartRouter.delete("/",userAuth, clearCart);
cartRouter.delete("/:productId",userAuth, removeCartItem);
 
export default cartRouter;