import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../Context/GobalState";
import axios from "axios";
import CarEmpty from "../Components/CarEmpty";
import Paypal from "../Components/Paypal";
import swal from "sweetalert";
const Cart = () => {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        console.log(prev, "prev");
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cart]);
  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };
  const increment = (id) => {
    cart.forEach((item) => {
      console.log(item, "forEach");
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };
  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };
  const removeProduct = async (id) => {
    return await swal({
      title: "Are you sure you want delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        cart.forEach((item, index) => {
          if (item._id === id) {
            cart.splice(index, 1);
          }
        });
        setCart([...cart]);
        addToCart(cart);
        swal("Delete Car successfully !", {
          icon: "success",
        });
      } else {
        swal("Thank you for 😆'!");
      }
    });
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    setCart([]);
    addToCart([]);
    swal("You have successfully placed an order.", {
      icon: "success",
    });
    console.log(payment);
  };
  if (cart.length === 0) return <CarEmpty />;
  return (
    <>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3>$ {product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="total">
        <h3>Total: $ {total}</h3>
        <Paypal total={total} tranSuccess={tranSuccess} />
      </div>
    </>
  );
};

export default Cart;
