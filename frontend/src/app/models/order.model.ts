export interface Order {
  _id: string;
  userId: string;
  products: {
    productId: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  totalAmount: number;
  paymentStatus: "Paid" | "Pending";
  stripeSessionId: string;
  createdAt: string;
  updatedAt: string;
}
