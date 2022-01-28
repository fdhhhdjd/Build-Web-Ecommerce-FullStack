import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/EmptyCart.css";
const CarEmpty = () => {
  const Navigate = useNavigate();
  return (
    <>
      <div className="emptyCart">
        <img
          src="https://merchlist.co/assets/emptycart.png"
          alt=""
          onClick={() => Navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </>
  );
};

export default CarEmpty;
