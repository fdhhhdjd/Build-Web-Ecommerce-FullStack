import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSmall from "./LoadingSmall";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";
import MetaData from "../Pages/MetaData";
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [google, setGoogle] = useState();
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const HandleGoogle = async (response) => {
    await axios
      .post("/user/loginGoogle", { tokenId: response.tokenId })
      .then((user) => {
        if (user) {
          localStorage.setItem("firstLogin", true);
          window.location.href = "/";
        }
        setGoogle(user);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const loginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/user/login", { ...user });
      if (res.status === 200) {
        toast.success(res.data.msg);
        localStorage.setItem("firstLogin", true);
        window.location.href = "/";
      } else if (res.data.status === 400) {
        toast.error(res.data.msg);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.msg);
    }
  };
  return (
    <>
      <MetaData title={`Login-Shop-Dev`} />

      <div className="login-page">
        <form onSubmit={loginSubmit}>
          <GoogleLogin
            clientId="1083950083676-fr9m6jsgig4aalf6mj81t8rlgl9v45bd.apps.googleusercontent.com"
            buttonText="Google +"
            onSuccess={HandleGoogle}
            onFailure={HandleGoogle}
            cookiePolicy={"single_host_origin"}
          />
          <h2>Login</h2>

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

          <div className="row">
            {loading ? (
              <LoadingSmall />
            ) : (
              <>
                <button type="submit">Login</button>
                <Link to="/register">Register</Link>
                <Link to="/forget">Forget</Link>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
