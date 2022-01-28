import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { GlobalState } from "../Context/GobalState";
import Loading from "./Loading";
import "../Styles/EditProfile.css";
import MetaData from "../Pages/MetaData";
const initialState = {
  name: "",
};
const EditProfile = () => {
  const state = useContext(GlobalState);
  const [images, setImages] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialState);
  const [profile] = state.userAPI.profile;
  const [token, setToken] = state.token;
  const refreshTokens = token;
  const [callback, setCallback] = state.callback;
  useEffect(() => {
    if (profile) {
      setUser({ ...profile });
      if (profile.url === "") {
        setImages(profile.image.url);
      } else {
        setImages(profile.image);
      }
    }
  }, [profile]);

  const navigate = useNavigate();
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images)
      return swal("No Image Upload 😅.", {
        icon: "error",
      });
    try {
      await axios.patch(
        `/user/profile/update`,
        { ...user, image: images },
        {
          headers: {
            Authorization: `${refreshTokens}`,
          },
        }
      );
      swal("Edit profile Successfully", {
        icon: "success",
      });
      setCallback(!callback);
      navigate("/profile");
    } catch (error) {
      swal(error.response.data.msg, {
        icon: "error",
      });
    }
  };
  const handleDestroy = async () => {
    try {
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: {
            Authorization: ` ${refreshTokens}`,
          },
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
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
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
          Authorization: `${refreshTokens}`,
        },
      });

      setLoading(false);
      setImages(res.data);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <>
      {user && (
        <>
          <MetaData title={`Edit-Profile-${profile.name}`} />

          <div className="container1">
            <div className="upload">
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={handleUpload}
              />
              {loading ? (
                <div id="file_img">
                  <Loading />
                </div>
              ) : (
                <div id="file_img" style={styleUpload}>
                  {profile.image && (
                    <img
                      src={images ? images.url : images}
                      alt=""
                      style={styleUpload}
                    />
                  )}
                  <span onClick={handleDestroy}>X</span>
                </div>
              )}
            </div>
            <div className="newUser">
              <h1 className="newUserTitle">Edit Profile</h1>
              <form onSubmit={handleSubmit}>
                <div className="newUserItem">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    placeholder="john"
                    name="name"
                    value={user.name}
                    onChange={handleChangeInput}
                  />
                </div>

                <div className="newUserItem">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="john@gmail.com"
                    name="email"
                    id="email"
                    value={user.email}
                    onChange={handleChangeInput}
                    disabled
                    style={{ color: "black" }}
                  />
                </div>

                <button className="newUserButton">Edit Profile</button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EditProfile;
