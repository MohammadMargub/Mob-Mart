import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import {
  useAllMobileQuery,
  useNewProductsMutation,
} from "../../../redux/api/productAPI";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";

const NewProduct = (p0: { id: string; formData: FormData }) => {
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>();
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();
  const navigate = useNavigate();

  const [createNewProduct] = useNewProductsMutation();

  const { data, error, isLoading } = useAllMobileQuery();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  console.log("Current User:", user);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };
  console.log("User ID:", user?._id);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Log the values before checking the fields
    console.log("Name:", name);
    console.log("Price:", price);
    console.log("Stock:", stock);
    console.log("Company:", company);
    console.log("Photo:", photo);

    if (!name || !price || !stock || !company || !photo) {
      console.error("Missing fields");
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("photo", photo);
    formData.set("company", company);

    try {
      const res = await createNewProduct({ id: user?._id!, formData }).unwrap();
      console.log("API Response:", res);
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  // const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!name || !price || !stock || !company || !photo) return;
  //   const formData = new FormData();
  //   formData.set("name", name);
  //   formData.set("price", price.toString());
  //   formData.set("stock", stock.toString());
  //   formData.set("photo", photo);
  //   formData.set("company", company);

  //   const res = await createNewProduct({ id: user?._id!, formData });
  //   responseToast(res, navigate, "/admin/product");
  // };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label htmlFor="name">Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="stock">Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="company">Company</label>
              <select
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="" disabled>
                  Select a company
                </option>
                {data?.mobileCompanies?.map((company: string) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="photo">Photo</label>
              <input required type="file" onChange={changeImageHandler} />
            </div>

            {photoPrev && <img src={photoPrev} alt="" />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
