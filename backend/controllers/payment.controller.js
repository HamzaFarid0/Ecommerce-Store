// import Stripe from "stripe";
// import OrderModel from "../models/order.model.js";
// import CartModel from '../models/cart.model.js';
// import ProductModel from "../models/product.model.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  const paymentWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET);
//   console.log("2) Signature verified ✅");
//   } catch {
//      console.log("❌ Signature verification failed:", err.message);
//     return res.status(400).send("Invalid signature");
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//      console.log("4) Session metadata:", session.metadata);
//     const userId = session.metadata.userId;
//    if (!userId) {
//       console.log("❌ No userId in metadata");
//       return res.json({ received: true });
//     }

//     const cart = await CartModel.findOne({ userId }).populate("items.productId");
//     if (!cart || cart.items.length === 0) {
//       return res.json({ received: true });
//     }
//   console.log("✅ Passed every checkpoint. Order SHOULD be created now!");
//     // Create order product snapshot
//     // const products = cart.items.map(i => ({
//     //   productId: i.productId._id,
//     //   name: i.productId.name,
//     //   image: i.productId.image || "",
//     //   price: i.productId.price,
//     //   quantity: i.quantity
//     // }));

//     // const totalAmount = products.reduce(
//     //   (sum, p) => sum + p.price * p.quantity,
//     //   0
//     // );

//     // await OrderModel.create({
//     //   userId,
//     //   products,
//     //   totalAmount,
//     //   paymentStatus: "Paid",
//     //   stripeSessionId: session.id,
//     //   shippingAddress: {
//     //     name: session.customer_details?.name || "",
//     //     line1: session.customer_details?.address?.line1 || "",
//     //     city: session.customer_details?.address?.city || "",
//     //     state: session.customer_details?.address?.state || "",
//     //     postal_code: session.customer_details?.address?.postal_code || "",
//     //     country: session.customer_details?.address?.country || "",
//     //     phone: session.customer_details?.phone || ""
//     //   }
//     // });

//     // Clear cart
//     // cart.items = [];
//     // await cart.save();
//      return res.json({ test: "SUCCESS UP TO HERE" });
//   }

//   return res.json({ received: true });
// };

// export { paymentWebhook }



// payment.controller.js

import Stripe from "stripe";
import OrderModel from "../models/order.model.js";
import CartModel from "../models/cart.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});

export const paymentWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  // 1. Verify Webhook Signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body,                      // raw body, not JSON parsed
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook Signature Failed:", err.message);
    return res.status(400).send("Webhook signature verification failed");
  }

  console.log("✅ Webhook Event Received:", event.type);

  // 2. Only handle checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log("🧾 Checkout Completed for User:", userId);

    // Fetch Cart Data
    const cart = await CartModel.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      console.log("⚠️ Cart empty. No order created.");
      return res.json({ received: true });
    }

    // 3. Build product snapshot
    const products = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.image || "",
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // 4. Create Order in DB
    const newOrder = await OrderModel.create({
      userId,
      products,
      totalAmount,
      paymentStatus: "Paid",
      stripeSessionId: session.id,
      shippingAddress: {
        name: session.customer_details?.name || "",
        line1: session.customer_details?.address?.line1 || "",
        city: session.customer_details?.address?.city || "",
        state: session.customer_details?.address?.state || "",
        postal_code: session.customer_details?.address?.postal_code || "",
        country: session.customer_details?.address?.country || "",
        phone: session.customer_details?.phone || ""
      }
    });

    console.log("✅ ORDER CREATED:", newOrder._id);

    // 5. Clear Cart
    cart.items = [];
    await cart.save();
    console.log("🧹 Cart cleared.");
  }

  return res.json({ received: true });
};
