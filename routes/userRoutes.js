const express = require('express')
const router = express.Router()
const {verifyIsLoggedIn, verifyIsAdmin} = require("../middleware/verifyAuthToken")
const { getUsers, registerUser, loginUser, updateUserProfile } = require("../controllers/userController")



router.post("/register", registerUser)
router.post("/login", loginUser)

//logged in user routes
router.use(verifyIsLoggedIn);
router.put("/profile", updateUserProfile);


//admin routes
router.use(verifyIsAdmin);
router.get("/", getUsers)

module.exports = router