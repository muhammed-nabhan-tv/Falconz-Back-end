import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import userAuth from "./middlewares/auth.js";
import productRouter from "./routes/productRoutes.js"
import cartRouter from "./routes/cartRoutes.js";
import wishlistRoter from "./routes/wishlistRoutes.js"
import orderRouter from "./routes/orderRoutes.js";
import AuthRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

// cookies middleware
app.use(cookieParser())
// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/users", userRoutes);
app.use("/api/products", productRouter);
app.use("/api/cart",userAuth,cartRouter)
app.use("/api/wishlist",userAuth,wishlistRoter)
app.use("/api/orders",userAuth,orderRouter)
app.use("/api/auth",AuthRouter)

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
});
// connect DB and start server
connectDB().then(() => {
  console.log("connected to database");

  app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
  });
});
