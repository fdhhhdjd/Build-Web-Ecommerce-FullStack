import React, { useContext, useState } from "react";
import { cartIcon, close, menu } from "../Imports/Icons";
import { Link } from "react-router-dom";
import { GlobalState } from "../Context/GobalState";
import axios from "axios";
import { toast } from "react-toastify";
const Header = () => {
  const [Menu, setMenu] = useState(false);
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  console.log(cart, "cart");
  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    toast.success("Logout Successfully 😆");
    window.location.href = "/login";
  };
  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>
        </li>
      </>
    );
  };
  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/Profile">Profile</Link>
        </li>
        <li>
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };
  const styleMenu = {
    left: Menu ? 0 : "-100%",
  };
  return (
    <>
      <header>
        <div className="menu" onClick={() => setMenu(!Menu)}>
          <img src={menu} alt="" width="30" />
        </div>

        <div className="logo">
          <h1>
            <Link to="/">{isAdmin ? "Admin" : "Shop Dev Web"}</Link>
          </h1>
        </div>

        <ul style={styleMenu}>
          <li>
            <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
          </li>

          {isAdmin && adminRouter()}

          {isLogged ? (
            loggedRouter()
          ) : (
            <li>
              <Link to="/login">Login ✥ Register</Link>
            </li>
          )}

          <li onClick={() => setMenu(!menu)}>
            <img src={close} alt="" width="30" className="menu" />
          </li>
        </ul>

        {isAdmin ? (
          ""
        ) : (
          <div className="cart-icon">
            <span>{cart.length}</span>
            <Link to="/cart">
              <img src={cartIcon} alt="" width="30" />
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
