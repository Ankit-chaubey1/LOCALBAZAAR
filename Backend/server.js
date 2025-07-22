const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
require("dotenv").config();

const connectDB = require("./DB/db")
const authRoutes = require("./Routes/auth.route")
const productRoutes = require("./Routes/product.route")
const userRoutes = require("./Routes/user.route")
const cartRoutes = require("./Routes/cart.route")

app.use(express.json())

app.use(
  cors({
    origin: ["http://localhost:5173", "https://localbazar-frontend.netlify.app/"], // Adjust this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/user", userRoutes)
app.use("/api/cart", cartRoutes)

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`)
  })
})

// {
//     "message": "Login successful",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBjNGFiNTdlYjZmMWEzMDUwMmYwMSIsImlhdCI6MTc1MjQzMjk3OCwiZXhwIjoxNzUyNDQwMTc4fQ.7hP69KuvzutmkT4zUYNZP_LwB1jE63OKHzzbNsCCF2M",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzBjNGFiNTdlYjZmMWEzMDUwMmYwMSIsImlhdCI6MTc1MjQzMjk3OCwiZXhwIjoxNzUzMjk2OTc4fQ.IgdfDrOTzb8-PByjkGuoPCjt4j-1JGXBRO1-IJolR8U",
//     "user": {
//         "id": "6870c4ab57eb6f1a30502f01",
//         "name": "Aman Singh",
//         "email": "aman1@gmail.com"
//     }
// }
