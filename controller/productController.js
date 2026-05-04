import * as productService from "../services/productService.js";

// Utility to handle async errors without try-catch blocks
const catchAsync = (fn) => (req, res ,next)=>{
    fn(req,res,next).catch(next);
}

// 1. Get All Products
export const getProducts = catchAsync(async(req,res)=>{
    const products = await productService.getProductsService();
    res.status(200).json(products)
})

// 2. Get product by Id
export const getProductById = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const product = await productService.getProductByIdService(id)
    res.status(200).json(product)
})

// 3. create product
export const addProduct = catchAsync(async(req,res)=>{
    const product = await productService.addProductService(req.body)
    res.status(201).json(product)
})

// 4. update product
export const updateProduct = catchAsync(async(req,res)=>{
    const update = await productService.updateProductService(
        req.params.id,
        req.body
    );
    res.status(200).json(update);
})

// 5. delete product 
export const deleteProduct = catchAsync(async(req,res)=>{
    const result = await productService.deleteProductService(req.params.id)
    res.status(200).json(result)
})