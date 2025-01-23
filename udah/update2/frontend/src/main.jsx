import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DataHandler from "./controller/DataHandler";
import AdminLayout from "./pages/layout/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminDetail from "./pages/admin/AdminDetail";
import AdminBarang from "./pages/admin/AdminBarang";
import AdminTransaction from "./pages/admin/AdminTransaction";
import AdminEdit from "./pages/admin/AdminEdit";
import AdminKupon from "./pages/admin/AdminKupon";
import AdminJenis from "./pages/admin/AdminJenis";
import AdminCart from "./pages/admin/AdminCart";
import AdminReport from "./pages/admin/ReportPenjualan";
import AdminCheckout from "./pages/admin/AdminCheckout";
import RegisterAdmin from "./pages/admin/RegisterAdmin";
import ReportPenjualanAdmin from "./pages/admin/ReportPenjualanAdmin";
import UserLayout from "./pages/layout/UserLayout";
import UserHome from "./pages/users/UserHome";
import UserDetail from "./pages/users/UserDetail";
import UserCart from "./pages/users/UserCart";
import UserCheckout from "./pages/users/UserCheckout";
import UserTransaction from "./pages/users/UserTransaction";
import UserTopup from "./pages/users/UserTopup";
import UserShowDetails from "./pages/users/UserShowDetails";
import ProtectedRoute from "./pages/layout/ProtectedRoute";
import Logout from "./pages/Logout";
import Details from "./pages/Details";
import store from "./store/store";

const {
  getAllData,
  RegisterAction,
  LoginAction,
  getUsername,
  showBarang,
  showDetailBarang,
  showJenis,
  adminHomeHandler,
  adminDetailHandler,
  addBarangHandler,
  adminTransaksiHandler,
  editBarangHandler,
  adminKuponHandler,
  addBarang,
  editBarang,
  addKupon,
  userHomeHandler,
  userDetailHandler,
  userCartHandler,
  showTransaksiHandler,
  handleDataAction,
  editCart,
  checkoutCart,
  addJenis,
  adminJenisHandler,
  registerAdminHandler,
  registerAnotherAdmin,
  adminCartHandler,
  adminReportHandler,
  adminCheckoutHandler,
  checkoutAdminCart,
  adminTransReportHandler,
  getDetailHome,
  topupSaldo,
  getCurrentSaldo,
  userTopUpPage,
  showDetailsHandler,
  updatePass,
} = DataHandler;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route>
        <Route index element={<Home />} loader={showBarang} />{" "}
        {/* This is the index route for the home page */}
        <Route
          path=":id"
          element={<Details />}
          loader={({ params }) => getDetailHome(params)}
        />
        <Route path="Register" element={<Register />} action={RegisterAction} />
        <Route path="Login" element={<Login />} action={LoginAction} />
        <Route path="admin" element={<AdminLayout />}>
          <Route
            path="home"
            element={
              <ProtectedRoute element={<AdminHome />} requiredRole={1} />
            }
            loader={adminHomeHandler}
          />
          <Route
            path="barang"
            element={
              <ProtectedRoute element={<AdminBarang />} requiredRole={1} />
            }
            loader={addBarangHandler}
            action={addBarang}
          />
          <Route
            path="transaksi"
            element={
              <ProtectedRoute element={<AdminTransaction />} requiredRole={1} />
            }
            loader={adminTransaksiHandler}
          />
          <Route
            path="barang/:id"
            element={
              <ProtectedRoute element={<AdminDetail />} requiredRole={1} />
            }
            loader={adminDetailHandler}
          />
          <Route
            path="barang/:id/edit"
            element={
              <ProtectedRoute element={<AdminEdit />} requiredRole={1} />
            }
            loader={editBarangHandler}
            action={editBarang}
          />
          <Route
            path="kupon"
            element={
              <ProtectedRoute element={<AdminKupon />} requiredRole={1} />
            }
            loader={adminKuponHandler}
            action={addKupon}
          />
          <Route
            path="jenis"
            element={
              <ProtectedRoute element={<AdminJenis />} requiredRole={1} />
            }
            loader={adminJenisHandler}
            action={addJenis}
          />
          <Route
            path="register"
            element={
              <ProtectedRoute element={<RegisterAdmin />} requiredRole={1} />
            }
            loader={registerAdminHandler}
            action={registerAnotherAdmin}
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute element={<AdminCart />} requiredRole={1} />
            }
            loader={adminCartHandler}
            action={editCart}
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute element={<AdminCheckout />} requiredRole={1} />
            }
            loader={adminCartHandler}
            action={checkoutAdminCart}
          />
          <Route
            path="report"
            element={
              <ProtectedRoute element={<AdminReport />} requiredRole={1} />
            }
            loader={adminReportHandler}
          />
          <Route
            path="report/admin"
            element={
              <ProtectedRoute
                element={<ReportPenjualanAdmin />}
                requiredRole={1}
              />
            }
            loader={adminTransReportHandler}
          />
        </Route>
        <Route path="user" element={<UserLayout />}>
          <Route
            path="home"
            element={<ProtectedRoute element={<UserHome />} requiredRole={2} />}
            loader={userHomeHandler}
          />
          <Route
            path="barang/:id"
            element={
              <ProtectedRoute element={<UserDetail />} requiredRole={2} />
            }
            loader={userDetailHandler}
            action={handleDataAction}
          />
          <Route
            path="transaksi"
            element={
              <ProtectedRoute element={<UserTransaction />} requiredRole={2} />
            }
            loader={showTransaksiHandler}
          />
          <Route
            path="cart"
            element={<ProtectedRoute element={<UserCart />} requiredRole={2} />}
            loader={userCartHandler}
            action={editCart}
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute element={<UserCheckout />} requiredRole={2} />
            }
            loader={userCartHandler}
            action={checkoutCart}
          />
          <Route
            path="topup"
            element={
              <ProtectedRoute element={<UserTopup />} requiredRole={2} />
            }
            action={topupSaldo} // Add the topupSaldo action
            loader={userTopUpPage} // Add the getCurrentSaldo loader
          />
          <Route
            path="details"
            element={
              <ProtectedRoute element={<UserShowDetails />} requiredRole={2} />
            }
            action={updatePass}
            loader={showDetailsHandler}
          />
        </Route>
      </Route>
      <Route path="logout" element={<Logout />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
