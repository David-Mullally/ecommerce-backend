const express = require('express')
const router = express.Router()
const {getUsers, registerUser, loginUser} = require("../controllers/userController")



router.post("/register", registerUser)
router.post("/login", loginUser)
//logged in user routes

//admin routes
router.get("/", getUsers)

module.exports = router