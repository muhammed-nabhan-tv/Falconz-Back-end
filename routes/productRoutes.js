import express from "express"
import {
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProduct
} from "../controller/productController.js"
import userAuth from "../middlewares/auth.js";

const productRouter = express.Router();

// 1. GET ALL PRODUCTS 
productRouter.get('/',getProducts);

// 2. GET PRODUCTS BY ID 
productRouter.get('/:id',getProductById);

// 3. CREATE NEW PRODUCT 
productRouter.post('/',addProduct);

// 4. UPDATE PRODUCT BY ID 
productRouter.put('/:id',updateProduct);

// 5. DELETE PRODUCT BY ID 
productRouter.delete('/:id',deleteProduct)

export default productRouter ;