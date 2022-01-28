import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { ProductApi } from "../Imports/Index";
import UserAPI from "../utils/UserApi";
import CategoriesAPI from "../utils/CategoryApi";
import { toast } from "react-toastify";
export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await axios.get("/user/refresh_token");
        setToken(res.data.accesstoken);
        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };
      refreshToken();
    }
  }, [callback]);
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      toast.success("Login Successfully 🥰");
    } else {
      toast.success("Logout Successfully 😊");
    }
  }, []);
  ProductApi();
  const data = {
    token: [token, setToken],
    productsApi: ProductApi(),
    userAPI: UserAPI(token),
    callback: [callback, setCallback],
    CategoriesAPI: CategoriesAPI(),
  };
  return <GlobalState.Provider value={data}>{children}</GlobalState.Provider>;
};
