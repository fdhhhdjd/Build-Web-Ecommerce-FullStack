import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { LoadingSmall } from "../Imports/Index";
import MetaData from "../Pages/MetaData";
const Forget = () => {
  const [user, setUser] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const ForgetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/user/forget", { ...user });
      setLoading(false);
      if (res.data.status === 200) {
        swal(res.data.msg, {
          icon: "success",
        });
        setUser({ email: "" });
      } else if (res.data.status === 400) {
        swal(res.data.msg, {
          icon: "error",
        });
      }
      console.log(res, "api");
    } catch (error) {
      setLoading(false);
      swal(error.response.data.msg, {
        icon: "error",
      });
    }
  };
  return (
    <>
      <MetaData title={`Forget-Shop-Dev`} />
      <div className="login-page">
        <form onSubmit={ForgetSubmit}>
          <h2>Forget</h2>
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={user.email}
            onChange={onChangeInput}
          />
          <div className="row">
            {loading ? (
              <LoadingSmall />
            ) : (
              <>
                <button type="submit">Forget</button>
                <Link to="/login">Login</Link>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Forget;
