import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

interface CartItemType {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

const cartItems: CartItemType[] = [
  {
    productId: "asasas",
    photo:
      "https://m.media-amazon.com/images/I/71RVuBs3q9L._AC_UY327_FMwebp_QL65_.jpg",
    name: "Samsung S24 Ultra",
    price: 124000,
    quantity: 12,
    stock: 20,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const discount = 4000;
const total = subtotal + tax + shippingCharges;

const Cart = () => {
  const [cuponCode, setCuponCode] = useState<string>("");
  const [isValidCuponCode, setisValidCuponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (Math.random() > 0.5) setisValidCuponCode(true);
      else setisValidCuponCode(false);
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [cuponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.map((i, index) => (
          <CartItem key={index} cartItem={i} />
        ))}{" "}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax : ₹{tax} </p>
        <p>
          Discount : <em> - ₹{discount} </em>
        </p>
        <p>
          <b>Total : ₹ {total}</b>
        </p>
        <input
          type="text"
          value={cuponCode}
          placeholder="Cupon Code"
          onChange={(e) => setCuponCode(e.target.value)}
        />
        {cuponCode &&
          (isValidCuponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{cuponCode}</code>{" "}
            </span>
          ) : (
            <span className="red">
              Invalid Cupon <MdErrorOutline />
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
