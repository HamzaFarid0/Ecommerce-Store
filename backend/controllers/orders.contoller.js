import CartModel from '../models/cart.model.js';
import OrderModel from '../models/order.model.js';

const viewOrders = async (req, res) => {
  try {
    const userId = req.user._id; // req.user from auth middleware

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch all orders for the user, most recent first
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // plain JS objects, no Mongoose document overhead

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("VIEW ORDERS ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }

};

export { viewOrders };
