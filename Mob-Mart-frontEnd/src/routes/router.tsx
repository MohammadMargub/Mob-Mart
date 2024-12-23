import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Login from "../pages/login";
import Header from "../components/header";
import Loader from "../components/loader";
import NotFound from "../pages/notFound";
import { RootState } from "../redux/store";
import ProtectedRoute from "../components/protectedRoute";
import { Skeleton } from "../components/loader";

const Cart = lazy(() => import("../pages/cart"));
const Home = lazy(() => import("../pages/home"));
const Search = lazy(() => import("../pages/search"));
const Orders = lazy(() => import("../pages/orders"));
const Shipping = lazy(() => import("../pages/shipping"));
const Products = lazy(() => import("../pages/admin/products"));
const Coupon = lazy(() => import("../pages/admin/apps/coupon"));
const Dashboard = lazy(() => import("../pages/admin/dashboard"));
const Customers = lazy(() => import("../pages/admin/customers"));
const OrderDetails = lazy(() => import("../pages/orderDetails"));
const Transaction = lazy(() => import("../pages/admin/transaction"));
const Barcharts = lazy(() => import("../pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("../pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("../pages/admin/charts/linecharts"));

const NewProduct = lazy(() => import("../pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("../pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("../pages/admin/management/transactionmanagement")
);

const AppRouter = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.user || { user: null, loading: false }
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? true : false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>
          {/* Admin Logs */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role == "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
          </Route>
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </Router>
  );
};

export default AppRouter;
