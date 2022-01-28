import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { toast } from "react-toastify";
const UserApi = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [profile, setProfile] = useState([]);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/infor", {
            headers: { Authorization: token },
          });
          setProfile(res.data);
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };

      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged)
      return swal({
        title: "Please login to continue buying?",
        text: "Login Buy Now!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          window.location.href = "/login";
        } else {
          swal("Thank You For 🙃!");
        }
      });
    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/user/addcart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Added cart successfully 😉 !");
    } else {
      swal("This product has been added to cart.", {
        icon: "error",
      });
    }
  };
  console.log(isAdmin);
  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
    profile: [profile, setProfile],
  };
};
export default UserApi;
