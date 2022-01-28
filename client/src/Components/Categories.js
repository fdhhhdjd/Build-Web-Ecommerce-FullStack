import React, { useState, useContext } from "react";
import { GlobalState } from "../Context/GobalState";
import axios from "axios";
import MetaData from "../Pages/MetaData";
import swal from "sweetalert";
const Categories = () => {
  const state = useContext(GlobalState);
  const [categories] = state.CategoriesAPI.categories;
  const [callback, setCallback] = state.CategoriesAPI.callback;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        swal(res.data.msg, {
          icon: "success",
        });
      } else {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        swal(res.data.msg, {
          icon: "success",
        });
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (error) {
      swal(error.response.data.msg, {
        icon: "error",
      });
    }
  };
  const deleteCategory = async (id) => {
    try {
      return await swal({
        title: "Are you sure you want delete ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios.delete(`/api/category/${id}`, {
            headers: { Authorization: token },
          });
          setCallback(!callback);
          swal("Delete Category successfully !", {
            icon: "success",
          });
        } else {
          swal("Thank you for 😆'!");
        }
      });
    } catch (error) {
      swal(error, {
        icon: "error",
      });
    }
  };
  const editCategory = (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };
  return (
    <>
      <MetaData title={`Category-Shop-Dev`} />

      <div className="categories">
        <form onSubmit={createCategory}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          />

          <button type="submit">{onEdit ? "Update" : "Create"}</button>
        </form>

        <div className="col">
          {categories.map((category) => (
            <div className="row" key={category._id}>
              <p>{category.name}</p>
              <div>
                <button
                  onClick={() => editCategory(category._id, category.name)}
                >
                  Edit
                </button>
                <button onClick={() => deleteCategory(category._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
