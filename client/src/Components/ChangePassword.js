import React, { useState, useContext, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { toast } from "react-toastify";
import { GlobalState } from "../Context/GobalState";
import "../Styles/ChangePassword.css";
const initialState = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
const ChangePassword = () => {
  const [user, setUser] = useState(initialState);
  const passwordEl = useRef();
  const [loading, setLoading] = useState(false);
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;
  const [success, setSuccess] = useState();
  const navigate = useNavigate();
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch(
        `/user/changePassword`,
        { ...user },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSuccess(res);
      if (res.data.status === 200) {
        swal(res.data.msg, {
          icon: "success",
        });
        setUser({
          oldPassword: "",
          password: "",
          confirmPassword: "",
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
      <section className="contact">
        <div className="containers">
          <div className="contactForm">
            <form onSubmit={handleSubmit}>
              <h2>Change Password </h2>
              <div className="inputBox">
                <input
                  type="password"
                  className="form-control"
                  name="oldPassword"
                  value={user.oldPassword}
                  ref={passwordEl}
                  required="required"
                  onChange={handleChangeInput}
                />
                <span>Old Password</span>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={user.password}
                  required="required"
                  onChange={handleChangeInput}
                />
                <span>New password</span>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  required="required"
                  onChange={handleChangeInput}
                />
                <span>Confirm Password</span>
              </div>

              <div className="inputBox">
                <input type="submit" name="" value="Change " />
                <input
                  type="submit"
                  name=""
                  value="Back Profile "
                  onClick={() => navigate("/profile")}
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
