import React from "react";
import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

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
      <img src={`${server}/${photo}`} alt={name} />
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
