export type Address = {
    address_id: number;
    user_id: string;
    postal_code: string;
    prefecture: string;
    city: string;
    street_address: string;
    building_name: string | null;
    room_number: string | null;
    country: string;
    address_type: "shipping" | "billing" | "default";
    is_default: boolean;
    recipient_first_name: string | null;
    recipient_last_name: string | null;
    recipient_phone_number: string | null;
  };

  export type AddressForm = {
    address_id?: number;
    user_id?: string;
    postal_code: string;
    prefecture: string;
    city: string;
    street_address: string;
    building_name: string | null;
    room_number: string | null;
    country: string;
    address_type?: "shipping" | "billing" | "default";
    is_default?: boolean;
    recipient_first_name: string | null;
    recipient_last_name: string | null;
    recipient_phone_number: string | null;
  };
  