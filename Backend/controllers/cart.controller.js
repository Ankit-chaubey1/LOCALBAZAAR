const User = require("../Models/user.model")
const Product = require("../Models/product.model")

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.userId

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check if user is trying to add their own product
    if (product.postedBy.toString() === userId) {
      return res.status(400).json({ message: "You cannot add your own product to cart" })
    }

    // Find user and check if product is already in cart
    const user = await User.findById(userId)
    if (user.cart.includes(productId)) {
      return res.status(400).json({ message: "Product already in cart" })
    }

    // Add product to cart
    user.cart.push(productId)
    await user.save()

    res.status(200).json({ message: "Product added to cart successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.userId

    const user = await User.findById(userId)
    user.cart = user.cart.filter((id) => id.toString() !== productId)
    await user.save()

    res.status(200).json({ message: "Product removed from cart successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId).populate({
      path: "cart",
      populate: {
        path: "postedBy",
        select: "name email phoneNo",
      },
    })

    res.status(200).json(user.cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId)
    user.cart = []
    await user.save()

    res.status(200).json({ message: "Cart cleared successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
}
