import React from "react";
import { Link } from "react-router-dom";
import ProductCart from "../components/product-cart";

const Home = () => {
  const addToCartHandler = () => {};

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCart
          productId="aaa"
          name="Samsung Galaxy S24 ultra"
          price={121000}
          stock={222}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/71RVuBs3q9L._AC_UY327_FMwebp_QL65_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
