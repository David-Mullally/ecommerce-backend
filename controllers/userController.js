const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");

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
    const { name, lastName, email, password, isAdmin } = req.body;
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
        isAdmin,
      });
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        )
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

const loginUser = async (req, res, next) => {
  try {
    const { email, password, remainLoggedIn } = req.body;
    if (!(email && password)) {
      return res.status(400).send("all fields are required");
    }

    const user = await User.findOne({ email });

    if (user && comparePasswords(password, user.password)) {
      let cookieParams = {
        httOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };

      if (remainLoggedIn) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
      }
      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        )
        .json({
          success: "user logged in",
          userLoggedIn: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            remainLoggedIn: user.remainLoggedIn,
          },
        });
    } else {
      res.status(401).send("wrong credentials");
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.finfById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastname = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async(req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (err) {
    next(err)
  }
}

const writeReview = async (req, res, next) => {
  try {
    // get commit, rating from req.body:
    const { comment, rating } = req.body;
    // validate request:
    if (!(comment && rating)) {
      res.status(400).send("All inputs are required");
    }

    // Create review ID manually because it is needed for saving in the product collection
    const ObjectId = require("mongodb").ObjectId;
    let reviewId = ObjectId();
    console.log(ObjectId, reviewId);

    await Review.create([
      {
        _id: reviewId,
        comment: comment,
        rating: Number(rating),
        user: { _id: req.user._id, name: req.user.name + " " + req.user.lastName },
      }
    ])
    res.send("review created")
  } catch(err) {
    next(err)
  }
}

module.exports = { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview};
