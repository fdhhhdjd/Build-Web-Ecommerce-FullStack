import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MetaData from "../Pages/MetaData";
import LoadingSmall from "./LoadingSmall";
const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const registerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/user/register", { ...user });
      if (res.status === 200) {
        setLoading(false);
        toast.success("Register Successfully 😉");
        navigate("/login");
      } else if (res.data.status === 400) {
        setLoading(false);
        toast.error(res.data.msg);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data.msg);
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  return (
    <>
      <MetaData title={`Register-Shop-Dev`} />
      <div className="login-page">
        <form onSubmit={registerSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            value={user.name}
            onChange={onChangeInput}
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={user.email}
            onChange={onChangeInput}
          />

          <input
            type="password"
            name="password"
            required
            autoComplete="on"
            placeholder="Password"
            value={user.password}
            onChange={onChangeInput}
          />
          <input
            type="password"
            name="confirmPassword"
            required
            autoComplete="on"
            placeholder="confirmPassword"
            value={user.confirmPassword}
            onChange={onChangeInput}
          />

          <div className="row">
            {loading ? (
              <LoadingSmall />
            ) : (
              <>
                <button type="submit">Register</button>
                <Link to="/login">Login</Link>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
