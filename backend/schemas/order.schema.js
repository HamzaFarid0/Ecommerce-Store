import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],

    shippingAddress: {
      name: { type: String, default: "" },
      line1: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postal_code: { type: String, default: "" },
      country: { type: String, default: "" },
      phone: { type: String, default: "" }
    },

    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Paid"
    },

    stripeSessionId: { type: String, required: true }
  },
  { timestamps: true }
);

export default OrderSchema;
