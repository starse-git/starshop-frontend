export interface CartProduct {
  tax: number;
  product_id: number;
  product_name: string;
  sale_price: number;
  quantity: number;
  total: number;
  cart_item_id: number;
  stock_quantity: number;
  safe_stock_quantity: number;
  product_images: string[];
}

export interface SubscriptionCartProduct {
  tax: number;
  product_id: number;
  name: string;
  sale_price: number;
  regular_discount: number;
  regular_percentage: number;
  quantity: number;
  total: number;
  stock_quantity: number;
  safe_stock_quantity: number;
  product_images: {
    image_url: string;
  }[];
}

export interface CartItem {
  user_id: string;
  cart_id: number;
  sub_total: number;
  tax_eight: number;
  tax_ten: number;
  cart_total_price: number;
  cart_item_id: string;
  products: CartProduct[];
}

export interface SubscriptionProduct {
  sub_total: number;
  tax_eight: number;
  tax_ten: number;
  total_price: number;
  products: SubscriptionCartProduct[];
}

