import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSmall from "./LoadingSmall";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import MetaData from "../Pages/MetaData";

const Login = () => {
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/user/password/reset/${token}`, { ...user });
      setSuccess(res);
      if (res.data.status === 200) {
        swal(res.data.msg, {
          icon: "success",
        });
      } else if (res.data.status === 400) {
        swal(res.data.msg, {
          icon: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.msg);
    }
  };
  return (
    <>
      <MetaData title={`Reset-Shop-Dev`} />
      <div className="login-page">
        {success && success.data.status === 200 ? (
          <div className="row">
            <form>
              <button type="submit" onClick={() => navigate("/login")}>
                Please Login
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={loginSubmit}>
            <h2>Reset</h2>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={user.password}
              onChange={onChangeInput}
            />

            <input
              type="password"
              name="confirmPassword"
              required
              autoComplete="on"
              placeholder="Password"
              value={user.confirmPassword}
              onChange={onChangeInput}
            />

            <div className="row">
              {loading ? (
                <LoadingSmall />
              ) : (
                <>
                  <button type="submit">Reset</button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;
