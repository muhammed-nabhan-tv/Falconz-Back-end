import Wishlist from "../model/wishlistSchema.js";
import Product from "../model/productModel.js";
import { AppError } from "../utils/errorHandler.js";

// add to wishlist
export const addToWishlistService = async (userId,productId)=>{
    if(!userId||!productId){
        throw new AppError("userId or productId is requires",400)
    }

    const product = await Product.findById(productId)
    if(!product)throw new AppError("product not found",404)
    
    let wishlist = await Wishlist.findOne({userId});    

    if(!wishlist){
        wishlist = new Wishlist({
            userId,
            products:[productId],
        })
    }else {
    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
    }
  }
    await wishlist.save();
  await wishlist.populate("products");

  return wishlist;
}

// get the all wishlist of user
export const getwishlistService = async(userId)=>{
    const wishlist = await Wishlist.findOne({userId}).populate('products')

    if(!wishlist){
        return {userId,products:[]} // empty wishlist
    }
    return wishlist
} 

// remove one wish list item
export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) throw new AppError("Wishlist not found", 404);

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  await wishlist.populate("products");

  return wishlist;
};

// clear the user wishlist
export const clearWishlistService = async (userId)=>{
    const wishlist = await Wishlist.findOne({userId})

    if(!wishlist)throw new AppError("wishlist not found",404)


    wishlist.products = []
    await wishlist.save();

    return wishlist
}