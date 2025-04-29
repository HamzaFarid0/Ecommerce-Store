

export interface CartItem {
    productId: string ;
    quantity: number;
    addedAt: string; 
  }
  
  export interface Cart {
    _id?: string;
    userId: string;
    items: CartItem[];
    createdAt: string; 
    updatedAt: string; 
  }
  
  export interface CartResponse {
    cart: {
      items: CartItem[];
      _id: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    };
    totalQuantity: number;
    totalPrice: number;
  }