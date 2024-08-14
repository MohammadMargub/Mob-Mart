import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

interface CartItemType {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartItemProps {
  cartItem: CartItemType;
}

const CartItem = ({ cartItem }: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem ?? {};

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span> ₹{price}</span>
      </article>

      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>
      <button>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
