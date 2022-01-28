import React, { useContext, useState } from "react";
import { GlobalState } from "../Context/GobalState";
import { ProductItem, Loading } from "../Imports/Index";
import axios from "axios";
import CarEmpty from "../Components/CarEmpty";
import LoadMore from "./LoadMore";
import Filters from "./Filters";
import MetaData from "../Pages/MetaData";
import swal from "sweetalert";
const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsApi.products;
  const [loading, setLoading] = useState(false);
  const [token, setToken] = state.token;
  const [callback, setCallback] = state.productsApi.callback;
  const [isAdmin] = state.userAPI.isAdmin;

  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    console.log(products);
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );

      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });

      await destroyImg;
      await deleteProduct;
      swal("Delete Products successfully 🤣!", {
        icon: "success",
      });
      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      swal(err.response.data.msg, {
        icon: "error",
      });
    }
  };
  ///
  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };
  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
    swal("Delete Products successfully 🤣!", {
      icon: "success",
    });
  };
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <>
      <MetaData title={`Shop-Dev-Web`} />
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete ALL</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
};

export default Products;
