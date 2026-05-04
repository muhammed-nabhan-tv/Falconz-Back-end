import * as cartService from '../services/cartService.js'

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const addToCart = catchAsync(async(req,res)=>{
    const {productId,quantity} = req.body;
    const cart = await cartService.addToCartService(
        req.user._id,
        productId,
        quantity)
    res.status(200).json({ message: "Item added to cart", cart });
})