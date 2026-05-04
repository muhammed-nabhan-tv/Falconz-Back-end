import express from "express";
import { addToCart } from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.post('/add',addToCart);

export default cartRouter;