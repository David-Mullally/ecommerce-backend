const express = require("express");
const router = express.Router();
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");
const {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderToPaid,
} = require("../controllers/orderController");

// user routes
router.use(verifyIsLoggedIn);
router.get("/", getUserOrders);
router.get("/user/:id", getOrder);
router.post("/", createOrder);
router.patch("/paid/:id", updateOrderToPaid);

//admin routes
router.use(verifyIsAdmin);

module.exports = router;
