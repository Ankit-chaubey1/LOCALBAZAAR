const express = require("express")
const router = express.Router()
const auth = require("../Middlewares/auth")
const { addToCart, removeFromCart, getCart, clearCart } = require("../controllers/cart.controller")

router.post("/add", auth, addToCart)
router.delete("/remove/:productId", auth, removeFromCart)
router.get("/", auth, getCart)
router.delete("/clear", auth, clearCart)

module.exports = router
