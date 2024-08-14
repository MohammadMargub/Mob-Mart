import { FaPlus } from "react-icons/fa";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
};

// const server = `My-server`;

const ProductCart = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productId,
  photo,
  name,
  price,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={`${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCart;
