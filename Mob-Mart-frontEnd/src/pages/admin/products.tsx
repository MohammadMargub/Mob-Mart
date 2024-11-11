import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import toast from "react-hot-toast";
import { customError } from "../../types/api-types";

import { UserReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../components/loader";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const user = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const { data, isError, isLoading, error } = useAllProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data) {
      const newRows = data.products.map((i) => {
        const imageUrl = `${server}${i.photo}`;

        return {
          photo: <img src={imageUrl} alt="image of a mobile" />,
          name: i.name,
          stock: i.stocks,
          price: i.price,
          action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
        };
      });
      setRows(newRows);
    }
  }, [data]);

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};
export default Products;
