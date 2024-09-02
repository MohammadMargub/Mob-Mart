import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Link } from "react-router-dom";
import { Column } from "react-table";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID ",
    accessor: "_id",
  },
  {
    Header: "Quantity ",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action ",
    accessor: "action",
  },
];

const Orders = () => {
  const [rows] = useState<DataType[]>([
    {
      _id: "ABC-123",
      amount: 121000,
      quantity: 5,
      discount: 9000,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/ABC-123`}>View</Link>,
    },
  ]);

  const Table = TableHOC<DataType>(
    column,
    rows,

    "dashboard-product-box",
    "Orders",
    true
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  );
};

export default Orders;
