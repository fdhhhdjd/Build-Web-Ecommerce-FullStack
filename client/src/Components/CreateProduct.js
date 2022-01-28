import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../Context/GobalState";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import MetaData from "../Pages/MetaData";
import swal from "sweetalert";
const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "",
  content: "",
  category: "",
  _id: "",
};

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [categories] = state.CategoriesAPI.categories;
  const [product, setProduct] = useState(initialState);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [products] = state.productsApi.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsApi.callback;

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      const file = e.target.files[0];
      if (!file)
        return swal("File not Exists", {
          icon: "error",
        });
      if (file.size > 1024 * 1024)
        // 1mb
        return swal("Size too large!", {
          icon: "error",
        });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return swal("File format is incorrect.", {
          icon: "error",
        });
      let formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (error) {
      swal(error.response.data.msg, {
        icon: "error",
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin)
        return swal("You're not an admin", {
          icon: "error",
        });
      if (!images)
        return swal("No Image Upload", {
          icon: "error",
        });
      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
        swal("Edit Products successfully 🤣!", {
          icon: "success",
        });
      } else {
        await axios.post(
          "/api/products",
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      }
      swal("Create Product successfully 😀 !", {
        icon: "success",
      });
      setCallback(!callback);
      navigate("/");
    } catch (error) {
      swal(error.response.data.msg, {
        icon: "error",
      });
    }
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleDestroy = async () => {
    try {
      if (!isAdmin)
        return swal("You're not an admin", {
          icon: "error",
        });
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (error) {
      swal(error.response.data.msg, {
        icon: "error",
      });
    }
  };
  const styleUpload = {
    display: images ? "block" : "none",
  };

  return (
    <>
      <MetaData title={`Create-Product`} />

      <div className="create_product">
        <div className="upload">
          <input type="file" name="file" id="file_up" onChange={handleUpload} />
          {loading ? (
            <div id="file_img">
              <Loading />
            </div>
          ) : (
            <div id="file_img" style={styleUpload}>
              <img src={images ? images.url : ""} alt="" />
              <span onClick={handleDestroy}>X</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="product_id">Product ID</label>
            <input
              type="text"
              name="product_id"
              id="product_id"
              required
              value={product.product_id}
              onChange={handleChangeInput}
              disabled={onEdit}
            />
          </div>

          <div className="row">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={product.title}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              required
              value={product.price}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              required
              value={product.description}
              rows="5"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="content">Content</label>
            <textarea
              type="text"
              name="content"
              id="content"
              required
              value={product.content}
              rows="7"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="categories">Categories: </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChangeInput}
            >
              <option value="">Please select a category</option>
              {categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">{onEdit ? "Update" : "Create"}</button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
