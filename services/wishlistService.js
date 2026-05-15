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
    
    let wishlist = await Wishlist.findOneAndUpdate(
      {userId},
      {
        $addToSet : { products : productId} // no duplicate
      },
      {
        new : true,
        upsert : true, // create if not exist
      }
    ).populate("products");    
    return wishlist
}

// get the all wishlist of user
export const getwishlistService = async(userId)=>{
    const wishlist = await Wishlist.findOne({userId}).populate('products')

    if(!wishlist){
        return {userId,products :[]} // empty wishlist
    }
    return wishlist
} 

// remove one wish list item
export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    {
      $pull: { products: productId }, // remove directly
    },
    { new: true }
  ).populate("products");

  if (!wishlist) throw new AppError("Wishlist not found", 404);

  return wishlist;
};

// clear the user wishlist
export const clearWishlistService = async (userId)=>{
    const wishlist = await Wishlist.findOneAndUpdate(
      {userId},
      {
        $set:{products:[]}
      },
      {new : true}
    );
    if(!wishlist)throw new AppError("wishlist not found",404)
      return wishlist
}