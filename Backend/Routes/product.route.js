const express = require("express")
const router = express.Router()

const auth = require("../Middlewares/auth")
const upload = require("../Middlewares/upload")
const productController = require("../controllers/product.controller")

router.post("/", auth, upload.single("image"), productController.createProduct)
router.get("/search/category", productController.searchByCategory)
router.get("/nearby", productController.getNearbyProducts)
router.get("/user/my", auth, productController.getMyProducts)
router.get("/", productController.getAllProducts)
router.get("/:id", productController.getProductById)
router.put("/:id", auth, upload.single("image"), productController.updateProduct)
router.delete("/:id", auth, productController.deleteProduct)

module.exports = router
