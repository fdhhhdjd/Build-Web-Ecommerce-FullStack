import react, { useState, useEffect } from "react";
import axios from "axios";

const CategoryApi = () => {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);
  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get("/api/category");
      setCategories(res.data);
    };

    getCategories();
  }, [callback]);
  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
};

export default CategoryApi;
