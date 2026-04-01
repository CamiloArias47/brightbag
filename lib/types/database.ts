export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  images: string[];
  attributes: Record<string, unknown> | null;
  created_at: string;
};

export type VariantRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_override: number | null;
  stock: number;
  created_at: string;
};

export type OrderStatus =
  | "pending"
  | "approved"
  | "declined"
  | "voided";

export type OrderRow = {
  id: string;
  wompi_reference: string;
  wompi_transaction_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, unknown>;
  city: string;
  department: string;
  total_amount: number;
  status: OrderStatus;
  payment_method?: "wompi" | "cod";
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  price_at_purchase: number;
};

export type ProductDimensions = {
  width_cm: number;
  height_cm: number;
  depth_cm: number;
};
