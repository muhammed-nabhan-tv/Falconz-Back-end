import { createOrderService, getUserOrdersService, getAllUserOrderService, updateOrderStatusService } from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
    try {
        const { source, items, shippingAddress, paymentMethod } = req.body;

        const order = await createOrderService({
            userId: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
        });

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (err) {
        next(err);
    }
};
export const getUserOrder = async (req, res, next) => {
    try {
        const orders = await getUserOrdersService(req.user._id);
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export const getAllUserOrders = async (req, res, next) => {
    try {
        const orders = await getAllUserOrderService()
        res.status(200).json({orders})
    } catch (err) {
        next(err)
    }
}

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body
        const order = await updateOrderStatusService(
            req.params.id,
            status
        )
        res.status(200).json({
            success: true,
            message: "Order status updated",
            order,
        })
    } catch (err) {
        next(err)
    }
}