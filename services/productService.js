import Product from "../model/productModel.js"
import { AppError } from "../utils/errorHandler.js"

// const formatProduct = (p) =>({
//     _id: p._id,
//     id: p._id,
//     name: p.name,
//     img: p.img,
//     category: p.categery,
//     price: p.price,
//     description: p.description,
//     isStock: p.isStock
// })
// // get all products
// export const getProductsService = async() =>{
//     const products = await Product.find()
//     return products.map(formatProduct)
// }

// export const getProductByIdService = async (id) =>{
//     // Validate if id is a valid MongoDB ObjectId to prevent cast errors
//     if(!id || id === "undefined"){
//         throw new AppError("invalid product id provided",400)
//     }

//     const product = await Product.findById(id);
//     if(!product){
//         throw new AppError("product is not in achive",404)
//     };
//     return formatProduct(product)
// }

export const getProductsService = async () => {
  return await Product.find();
};

export const getProductByIdService = async (id) => {
  if (!id) throw new AppError("Invalid product id", 400);

  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const deleteProductService = async (id) =>{
    const deleted = await Product.findByIdAndDelete(id);
    if(!deleted)throw new AppError("product not found",404)
        return {message : "Product successfully removed", id:deleted._id}
}

export const updateProductService = async (id,data) => {
    if(!id)throw new AppError("invalid product Id",400)

    const updated = await Product.findByIdAndUpdate(id,data,{
        new:true,
        runValidators: true
    })
    if(!updated)throw new AppError("product not found",404)
        return updated
}

export const addProductService = async (data) =>{
    const {name,price,description,img,category,isStock} = data
    if(!name,!price,!img,!description,!category,!isStock){
        throw new AppError("all fields are required",400)
    }
    const product = await Product.create({
        name,
        img,
        price,
        description,
        category,
        isStock
    })
    return product
}