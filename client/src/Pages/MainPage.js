import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { GlobalState } from "../Context/GobalState";
import {
  Login,
  Register,
  Cart,
  Products,
  DetailProduct,
  NotFound,
  OrderHistory,
  CreateProduct,
  OrderDetails,
  Categories,
  Forget,
  Reset,
  Profile,
} from "../Imports/Index";
import { ToastContainer } from "react-toastify";
import EditProfile from "../Components/EditProfile";
import ChangePassword from "../Components/ChangePassword";
const MainPage = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  return (
    <>
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/detail/:id" element={<DetailProduct />} />
        <Route path="/login" element={!isLogged ? <Login /> : <NotFound />} />
        <Route
          path="/register"
          element={!isLogged ? <Register /> : <NotFound />}
        />
        <Route path="/forget" element={!isLogged ? <Forget /> : <NotFound />} />
        <Route
          path="/password/reset/:token"
          element={!isLogged ? <Reset /> : <NotFound />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/history"
          element={isLogged ? <OrderHistory /> : <NotFound />}
        />
        <Route
          path="/profile/edit"
          element={isLogged ? <EditProfile /> : <NotFound />}
        />
        <Route
          path="/profile"
          element={isLogged ? <Profile /> : <NotFound />}
        />
        <Route
          path="/changePassword"
          element={isLogged ? <ChangePassword /> : <NotFound />}
        />
        <Route
          path="/history/:id"
          element={isLogged ? <OrderDetails /> : <NotFound />}
        />
        <Route
          path="/category"
          element={isAdmin ? <Categories /> : <NotFound />}
        />
        <Route
          path="/create_product"
          element={isAdmin ? <CreateProduct /> : <NotFound />}
        />
        <Route
          path="/edit_product/:id"
          element={isAdmin ? <CreateProduct /> : <NotFound />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default MainPage;
