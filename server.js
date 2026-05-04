import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import userAuth from "./middlewares/auth.js";
import productRouter from "./routes/productRoutes.js"
import cartRouter from "./routes/cartRoutes.js";
import wishlistRoter from "./routes/wishlistRoutes.js"
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

// connect DB and start server
connectDB().then(() => {
  console.log("connected to database");

  app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
  });
});
