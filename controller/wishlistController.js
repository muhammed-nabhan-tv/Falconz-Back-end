import * as wishlistService from "../services/wishlistService.js";

// helper
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


// ✅ 1. ADD TO WISHLIST
export const addToWishlist = catchAsync(async (req, res) => {
  const { productId } = req.body;

  const wishlist = await wishlistService.addToWishlistService(
    req.user.id,
    productId
  );

  res.status(200).json({
    message: "Added to wishlist",
    wishlist,
  });
});


// ✅ 2. GET WISHLIST
export const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getwishlistService(req.user.id);

  res.status(200).json(wishlist);
});


// ✅ 3. REMOVE ITEM
export const removeFromWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await wishlistService.removeFromWishlistService(
    req.user.id,
    productId
  );

  res.status(200).json({
    message: "Removed from wishlist",
    wishlist,
  });
});


// ✅ 4. CLEAR WISHLIST
export const clearWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.clearWishlistService(req.user.id);

  res.status(200).json({
    message: "Wishlist cleared",
    wishlist,
  });
});