import React from "react";
import { FaPlus } from "react-icons/fa";

type ProductsProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: () => string | undefined;
};

const server = "111";

const productCards = ({
  productId,
  price,
  name,
  photo,
  stock,
}: // handler,
ProductsProps) => {
  function handler(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="productcard">
      <img src={photo} alt={name} />
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

export default productCards;
