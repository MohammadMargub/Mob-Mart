import { useState } from "react";
import ProductCart from "../components/product-cart";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(180000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addToCartHandler = () => {};

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  return (
    <>
      <div className="product-search-page">
        <aside>
          <h2>filter</h2>

          <div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">None</option>
              <option value="asc">Price(Low to High)</option>
              <option value="dsc">Price(High to Low)</option>
            </select>
          </div>

          <div>
            <h4>Max Price : {maxPrice || ""}</h4>
            <input
              type=""
              min={50}
              max={180000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <h4>Category</h4>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Apple</option>
              <option value="">Samsung</option>
              <option value="">Moto</option>
              <option value="">Nothing</option>
              <option value="">One-Plus</option>
              <option value="">Realme</option>
              <option value="">Redmi</option>
            </select>
          </div>
        </aside>
        <main>
          <h1>Products</h1>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-product-list">
            <ProductCart
              productId="aaa"
              name="Samsung Galaxy S24 ultra"
              price={121000}
              stock={222}
              handler={addToCartHandler}
              photo="https://m.media-amazon.com/images/I/71RVuBs3q9L._AC_UY327_FMwebp_QL65_.jpg"
            />
          </div>

          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {4}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        </main>
      </div>
    </>
  );
};

export default Search;
