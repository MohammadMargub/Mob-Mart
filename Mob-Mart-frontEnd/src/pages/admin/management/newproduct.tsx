import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import {
  useAllMobileQuery,
  useNewProductMutation,
} from "../../../redux/api/productAPI";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RootState } from "../../../redux/store";
import { MessageResponse } from "../../../types/api-types";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [price, setPrice] = useState<number | string>(0);
  const [stocks, setStocks] = useState<number | string>(0);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const navigate = useNavigate();

  const [createNewProduct] = useNewProductMutation<MessageResponse>();

  const { data, error, isLoading } = useAllMobileQuery();

  const { user, loading } = useSelector(
    (state: RootState) => state.user || { user: null, loading: false }
  );
  useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      toast.error("User must be logged in to create a product.");
      navigate("/login");
    }
  }, [user, navigate]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      setPhoto(file);
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.error("User ID is undefined");
      toast.error("User must be logged in to create a product.");
      return;
    }

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", price?.toString() || "10000");
    formData.set("stocks", stocks?.toString() || "1");
    formData.append("company", company);

    if (photo) {
      formData.set("photo", photo);
    } else {
      console.error("Photo is not defined");
      toast.error("Please upload a photo.");
      return;
    }

    try {
      const res = await createNewProduct({
        formData,
        id: user._id,
      }).unwrap();

      toast.success(res.message);
      navigate("/admin/product");
    } catch (error) {
      console.error("Product creation failed:", error);
      toast.error("Product creation failed");
    }
  };

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
                value={price || ""}
                onChange={(e) =>
                  setPrice(e.target.value ? Number(e.target.value) : 0)
                }
              />
            </div>
            <div>
              <label htmlFor="stocks">stocks</label>
              <input
                required
                type="number"
                placeholder="stocks"
                value={stocks}
                onChange={(e) =>
                  setStocks(e.target.value ? Number(e.target.value) : 0)
                }
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
