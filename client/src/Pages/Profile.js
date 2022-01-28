import React, { useContext } from "react";
import "../Styles/Profile.css";
import { Link } from "react-router-dom";
import { GlobalState } from "../Context/GobalState";
import MetaData from "./MetaData";

const Profile = () => {
  const state = useContext(GlobalState);
  const [profile] = state.userAPI.profile;
  const auth = profile;
  return (
    <>
      <>
        <MetaData title={`${auth.name}'s Profile`} />
        <div className="profileContainer">
          <div>
            <h1>My Profile</h1>
            {auth.image && <img src={auth.image.url} alt={auth.name} />}
            <Link to="/profile/edit">Edit Profile</Link>
          </div>
          <div>
            <div>
              <h4>Full Name</h4>
              <p>{auth.name || "Chưa thêm đầy đủ tên !"}</p>
            </div>
            <div>
              <h4>Email</h4>
              <p>{auth.email}</p>
            </div>

            <div>
              <h4>Joined On</h4>

              <p>{String(auth.createdAt).substr(0, 10)}</p>
            </div>

            <div>
              <Link to="/orders">My Orders</Link>
              <Link to="/changePassword">Change Password</Link>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Profile;
