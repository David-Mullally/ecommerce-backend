const User = require("../models/UserModel");
const { hashPassword } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken")

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("user already exists");
    } else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      res
        .cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(201)
        .json({
          success: "user created successfully",
          userCreated: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = { getUsers, registerUser };
