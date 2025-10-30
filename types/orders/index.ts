export type OrderItem = {
  product_id: number;
  sale_price: number;
  product_name: string;
  product_images: string[];
  product_quantity: number;
  product_subtotal: number;
  tax: number;
};

export type OrderSummary = {
  order_id: number;
  order_date: string;
  order_status: string;
  shipping_cost: number;
  order_total: number;
  customer_id: number;
  customer_name: string;
  customer_photo: string;
  order_items: OrderItem[];
};

export type OrderDetails = {
  order_id: number;
  order_date: string;
  order_status: string;
  shipping_cost: number;
  shipping_company: string;
  tracking_number: string;
  order_total: number;
  eight_percent_total: number;
  ten_percent_total: number;
  customer_id: string;
  customer_name: string;
  shipping_address: Address;
  billing_address: Address;
  products: Product[];
};

type Address = {
  first_name: string;
  last_name: string;
  phone: string;
  postal_code: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  room: string;
  country: string;
};

export type Product = {
  product_id: number;
  product_name: string;
  tax: number;
  price: number;
  quantity: number;
  subtotal: number;
  images: string[];
};

export type Order = {
  total_amount: number;
  shipping_address_id: number;
  billing_address_id: number;
  payment_method: string;
  transaction_id: string;
};

export type OrderItemCreate = {
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
};

export type OrderSummaryDetails = {
  order_id: number;
  order_date: string;
  order_status: string;
  shipping_cost: number;
  order_total: number;
  customer_id: number;
  customer_name: string;
  customer_photo: string;
  order_items: OrderItem[];
};

export type OrderEmailBody = {
  orderId: number;
  total: number;
  products: Product[];
};


