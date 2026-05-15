import * as cartService from "../services/cartService.js";

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  // FIX: use req.user._id consistently everywhere
  const cart = await cartService.addToCartService(
    req.user._id,
    productId,
    quantity
  );
  res.status(200).json({ message: "Item added to cart", cart });
});

export const getUserCart = catchAsync(async (req, res) => {
  // FIX: was req.user.id — changed to req.user._id for consistency
  const cart = await cartService.getUserCartService(req.user._id);
  res.status(200).json(cart);
});

export const removeCartItem = catchAsync(async (req, res) => {
  const { productId } = req.params;
  // FIX: was req.user.id — changed to req.user._id for consistency
  const cart = await cartService.removeCartItemService(
    req.user._id,
    productId
  );
  res.status(200).json({ items: cart.items });
});

export const clearCart = catchAsync(async (req, res) => {
  // FIX: was req.params.userId which is undefined — the route has no :userId param
  // Changed to req.user._id to get userId from the auth middleware
  await cartService.clearCartService(req.user._id);
  res.status(200).json({items : cart.items});
});