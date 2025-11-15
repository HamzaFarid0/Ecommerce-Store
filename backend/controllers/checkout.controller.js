import CartModel from '../models/cart.model.js';
import OrderModel from '../models/order.model.js';
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate product details
    const cart = await CartModel.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.name,
          images: item.productId.image ? [item.productId.image] : []
        },
        unit_amount: Math.round(item.productId.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "PK", "GB", "CA"],
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId: userId.toString() },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.log("CHECKOUT ERROR:", err);
    return res.status(500).json({ error: "Checkout Error" });
  }
};

const verifySession = async (req, res) => {

  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: "Session ID required" });

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const order = await OrderModel.findOne({ stripeSessionId: session_id })
  if (!order) {
    return res.json({ success: true,order_id: null, });
 }
  
  const orderId = order?._id;
  const date = order?.createdAt
  
   console.log('orderId Session : ' , orderId)
   console.log('session.amount_total' , session.amount_total)
    return res.json({
      success: true,
      date : date,
      order_id : orderId,
      amount_total: session.amount_total / 100,
      currency: session.currency,
      customer_email: session.customer_details?.email || "",
      payment_status: session.payment_status,
      shipping: session.customer_details?.address || null
    });
  } catch (err) {
    console.log("VERIFY SESSION ERROR:", err.message);
    return res.status(500).json({ error: "Failed to verify session" });
  }

}

export { checkout , verifySession };
