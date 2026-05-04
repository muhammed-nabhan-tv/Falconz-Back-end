// import { application } from "express"
import Product from "../model/productModel.js"
import { AppError } from "../utils/errorHandler.js"

const formatProduct = (p) =>({
    _id: p._id,
    id: p._id,
    name: p.name,
    img: p.img,
    category: p.categery,
    price: p.price,
    description: p.description,
    isStock: p.isStock
})
// get all products
export const getProductsService = async() =>{
    const products = await Product.find()
    return products.map(formatProduct)
}

export const getProductByIdService = async (id) =>{
    // Validate if id is a valid MongoDB ObjectId to prevent cast errors
    if(!id || id === "undefined"){
        throw new AppError("invalid product id provided",400)
    }

    const product = await Product.findById(id);
    if(!product){
        throw new AppError("product is not in achive",404)
    };
    return formatProduct(product)
}