export type CustomerWithTotalOrderAmount = {
  user_id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  first_name_kana: string | null;
  last_name_kana: string | null;
  user_photo: string | null;
  phone_number: string | null;
  registration_date: string;
  last_login: string;
  user_type: "customer" | "admin" | string;
  is_active: boolean;
  total_order_amount: number;
};

export type Customer = {
    user_id: string;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    first_name_kana: string | null;
    last_name_kana: string | null;
    user_photo: string | null;
    phone_number: string | null;
    registration_date: string; 
    last_login: string; 
    user_type: "customer" | string;
    is_active: boolean;
    total_order_amount?: number;
  };
  
