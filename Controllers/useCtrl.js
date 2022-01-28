const Users = require("../models/userModle");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("./SendEmail");
const CLIENT_ID = process.env.GOOGLE_CLIENT_IDS;
const client = new OAuth2Client(CLIENT_ID);
const path = require("path");
const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (!password)
        return res.status(400).json({
          status: 400,
          success: false,
          msg: "Password are not empty.",
        });

      if (!confirmPassword)
        return res.status(400).json({
          status: 400,
          success: false,
          msg: " Confirm are not empty.",
        });

      if (password.length < 6)
        return res.status(400).json({
          status: 400,
          success: false,
          msg: "Password is at least 6 characters long.",
        });

      let reg = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
      ).test(password);
      if (!reg) {
        return res.status(400).json({
          status: 400,
          success: false,
          msg: "Includes 6 characters, uppercase, lowercase and some and special characters.",
        });
      }
      if (confirmPassword !== password) {
        return res.status(400).json({
          status: 400,
          success: false,
          msg: "Password and confirm password does not match!",
        });
      }
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // Save mongodb
      await newUser.save();

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id, name }); //muon lay gi lay o day
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.status(200).json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken, status: 200 });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  ChangePassword: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("+password");
      const { password, oldPassword, confirmPassword } = req.body;
      if (!password)
        return res.json({
          status: 400,
          success: false,
          msg: "Password are not empty.",
        });

      if (!confirmPassword)
        return res.json({
          status: 400,
          success: false,
          msg: " Confirm are not empty.",
        });

      if (!oldPassword)
        return res.json({
          status: 400,
          success: false,
          msg: "Old Password are not empty.",
        });

      if (password.length < 6)
        return res.json({
          status: 400,
          success: false,
          msg: "Password is at least 6 characters long.",
        });

      let reg = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
      ).test(password);
      if (!reg) {
        return res.json({
          status: 400,
          success: false,
          msg: "Includes 6 characters, uppercase, lowercase and some and special characters.",
        });
      }
      if (confirmPassword !== password) {
        return res.json({
          status: 400,
          success: false,
          msg: "Password and confirm password does not match!",
        });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.json({
          status: 400,
          success: false,
          msg: " Old Password Incorrect",
        });
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const userPassword = await Users.findByIdAndUpdate(
        { _id: user.id },
        { password: passwordHash },
        { new: true }
      );
      return res.status(200).json({
        status: 200,
        success: true,
        msg: "Change Password Successfully 😂!",
      });
    } catch (err) {
      return res.json({
        status: 400,
        msg: err.message,
      });
    }
  },
  forgetPasswordCustomer: async (req, res) => {
    const user = await Users.findOne({ email: req.body.email });
    const { email } = req.body;
    if (!email) {
      res.json({
        status: 400,
        success: false,
        msg: "Email are not empty. ",
      });
    }
    if (!user) {
      res.json({
        status: 400,
        success: false,
        msg: "Account Not Exit",
      });
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/customer/password/reset/${resetToken}`;
    //const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
      await sendEmail({
        email: user.email,
        subject: `Forgot Password`,
        template: "forgot-password",
        attachments: [
          {
            filename: "netflix.jpg",
            path: path.resolve("./views", "images", "netflix.jpg"),
            cid: "netflix_logo",
          },
          {
            filename: "question.png",
            path: path.resolve("./views", "images", "question.png"),
            cid: "question_img",
          },
        ],
        context: {
          resetPasswordUrl,
        },
      });

      return res.status(200).json({
        status: 200,
        success: true,
        msg: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: true });
      console.log(error);
    }
  },
  resetPassword: async (req, res) => {
    const { password, confirmPassword } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Users.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Reset Password Token is invalid or has been expired",
      });
    }

    if (!password)
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Password are not empty.",
      });

    if (!confirmPassword)
      return res.status(400).json({
        status: 400,
        success: false,
        msg: " Confirm are not empty.",
      });

    if (password.length < 6)
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Password is at least 6 characters long.",
      });

    let reg = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
    ).test(password);
    if (!reg) {
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Includes 6 characters, uppercase, lowercase and some and special characters.",
      });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        status: 400,
        success: false,
        msg: "Password and confirm password does not match!",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.password, salt);
    const userPassword = await Users.findByIdAndUpdate(
      { _id: user.id },
      { password: passwordHash },
      { new: true }
    );
    res.status(200).json({
      status: 200,
      success: true,
      msg: "Reset successfully",
    });
  },
  LoginGoogleCustomer: async (req, res) => {
    const { tokenId } = req.body;
    client
      .verifyIdToken({
        idToken: tokenId,
        audience: process.env.CLIENT_ID,
      })
      .then((response) => {
        const { email_verified, name, email, picture } = response.payload;
        console.log(response.payload);
        if (email_verified) {
          Users.findOne({ email }).exec((error, user) => {
            if (error) {
              return res.status(400).json({
                status: 400,
                success: false,
                msg: "Invalid Authentication",
              });
            } else {
              if (user) {
                const accesstoken = createAccessToken({
                  id: user._id,
                });
                const refreshtoken = createRefreshToken({
                  id: user._id,
                });

                res.cookie("refreshtoken", refreshtoken, {
                  httpOnly: true,
                  path: "/user/refresh_token",
                  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
                });
                const { _id, name, email, image } = user;
                res.status(200).json({
                  status: 200,
                  success: true,
                  msg: "Login successfully",
                  accesstoken,
                  user: { _id, name, email, image },
                });
              } else {
                let password = email + process.env.ACCESS_TOKEN_SECRET;
                let newUser = new Users({
                  name: name,
                  email,
                  password,
                  image: {
                    public_id: password,
                    url: picture,
                  },
                });
                newUser.save((err, data) => {
                  if (err) {
                    return res.status(400).json({
                      status: 400,
                      success: false,
                      msg: "Invalid Authentication",
                    });
                  }
                  const accesstoken = createAccessToken({
                    id: data._id,
                  });
                  const refreshtoken = createRefreshToken({
                    id: data._id,
                  });

                  res.cookie("refreshtoken", refreshtoken, {
                    httpOnly: true,
                    path: "/user/refresh_token",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
                  });
                  const { _id, name, email, image } = newUser;
                  res.json({
                    status: 200,
                    success: true,
                    msg: "Register successfully",
                    accesstoken,
                    user: { _id, name, email, image },
                  });
                  console.log(user);
                });
              }
            }
          });
        }
      });
  },
  profile: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user)
        return res.status(400).json({
          status: 400,
          success: false,
          msg: "User does not exist.",
        });
      res.status(200).json({
        status: 200,
        success: true,
        user,
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        msg: err.message,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { name, image } = req.body;
      if (!image)
        return res.json({
          status: 400,
          success: false,
          msg: "No image upload",
        });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          image,
        }
      );
      res.status(200).json({
        status: 200,
        success: true,
        msg: "Updated Profile Successfully !",
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        msg: err.message,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserAll: async (req, res) => {
    try {
      const user = await Users.find().select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserChar: async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);

    try {
      const data = await Users.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });
      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
module.exports = userCtrl;
