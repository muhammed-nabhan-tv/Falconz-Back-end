import express from "express";
import { createOrder,
     getUserOrder,
     getAllUserOrders,
     updateOrderStatus
    //   getOrderById 
    // getUserOrders
    } from "../controller/orderController.js";
import userAuth from "../middlewares/auth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.patch(
  "/:id",
  userAuth,
  adminAuth,
  updateOrderStatus
);
orderRouter.get('/allorders',userAuth,adminAuth,getAllUserOrders)
orderRouter.get('/my-orders',userAuth,getUserOrder);
export default orderRouter;
