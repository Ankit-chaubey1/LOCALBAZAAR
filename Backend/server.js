// const express = require("express")
// const app = express()
// const port = 3000
// const cors = require("cors")
// require("dotenv").config();

// const connectDB = require("./DB/db")
// const authRoutes = require("./Routes/auth.route")
// const productRoutes = require("./Routes/product.route")
// const userRoutes = require("./Routes/user.route")
// const cartRoutes = require("./Routes/cart.route")

// app.use(express.json())

// app.use(
//   cors({
//     origin: ["http://localhost:5173"], // Adjust this to your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// )

// app.get("/", (req, res) => {
//   res.send("Hello World!")
// })

// app.use("/api/auth", authRoutes)
// app.use("/api/products", productRoutes)
// app.use("/api/user", userRoutes)
// app.use("/api/cart", cartRoutes)

// // Connect DB and Start Server
// connectDB().then(() => {
//   app.listen(port, () => {
//     console.log(`✅ Server is running on http://localhost:${port}`)
//   })
// })

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


const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./DB/db");
const authRoutes = require("./Routes/auth.route");
const productRoutes = require("./Routes/product.route");
const userRoutes = require("./Routes/user.route");
const cartRoutes = require("./Routes/cart.route");

const app = express();

// --- 1) PORT must come from env for Render ---
const PORT = process.env.PORT || 3000;

// --- 2) CORS: allow localhost + your Vercel domain (or temporarily allow all) ---
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // we’ll put your Vercel URL here once you have it
];

// Simple: allow everything until your frontend is live, then lock it down:
// app.use(cors());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return cb(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /vercel\.app$/.test(new URL(origin).hostname) // any *.vercel.app
      ) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
});
