import express from "express"
import {
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProduct
} from "../controller/productController.js"
import userAuth from "../middlewares/auth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const productRouter = express.Router();

// 1. GET ALL PRODUCTS 
productRouter.get('/',getProducts);

// 2. GET PRODUCTS BY ID 
productRouter.get('/:id',userAuth,getProductById);

// 3. CREATE NEW PRODUCT 
productRouter.post('/',userAuth,adminAuth,addProduct);

// 4. UPDATE PRODUCT BY ID 
productRouter.put('/:id',adminAuth,updateProduct);

// 5. DELETE PRODUCT BY ID 
productRouter.delete('/:id',adminAuth,deleteProduct)

export default productRouter ;