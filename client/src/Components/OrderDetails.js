import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../Context/GobalState";
import CarEmpty from "./CarEmpty";

const OrderDetails = () => {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetails, setOrderDetails] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      history.forEach((item) => {
        if (item._id === id) {
          setOrderDetails(item);
        }
      });
    }
  }, [id, history]);
  if (orderDetails.length === 0) return <CarEmpty />;
  return (
    <>
      <div className="history-page">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Postal Code</th>
              <th>Country Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{orderDetails.address.recipient_name}</td>
              <td>
                {orderDetails.address.line1 + " - " + orderDetails.address.city}
              </td>
              <td>{orderDetails.address.postal_code}</td>
              <td>{orderDetails.address.country_code}</td>
            </tr>
          </tbody>
        </table>

        <table style={{ margin: "30px 0px" }}>
          <thead>
            <tr>
              <th></th>
              <th>Products</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.cart.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.images.url} alt="" />
                </td>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>$ {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderDetails;
