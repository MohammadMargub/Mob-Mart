export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export interface Product {
  stocks: number;
  name: string;
  category: string;
  photo: string;
  _id: string;
  price: number;
  company: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  role: string;
  photo: string;
  dob: string;
}

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};
