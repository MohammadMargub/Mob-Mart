import { Link } from "react-router-dom";
import ProductCart from "../components/product-cart";
import { productAPI, useLatestProductsQuery } from "../redux/api/productAPI";
import { Skeleton } from "../components/loader";
import toast from "react-hot-toast";

const Home = () => {
  const { data, isLoading, isError, error } = useLatestProductsQuery();

  if (isError) {
    toast.error("Can't Fetch the Products");
  }

  console.log(productAPI);
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
        {isLoading ? (
          <Skeleton />
        ) : (
          data?.products.map((i: any) => (
            <ProductCart
              key={i._id}
              productId={i._id}
              name={`${i.company} ${i.name}`}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
