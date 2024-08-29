const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
require('dotenv').config();
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.set("trust proxy", true);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://shabby-frontend.vercel.app","http://localhost:8081"
  
    ], // 
    Headers: true,
    exposedHeaders: "Set-Cookie",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // Allow only specified HTTP methods
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
      "cookies",
    ],
    credentials: true, // Allow sending cookies and other credentials
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
//Routers import
const userRouter = require("./routes/userRoutes");
const branch_routs = require("./routes/branch_routs");
const website_roues = require("./routes/website_roues");
app.use("/api/v1/auth", userRouter);
app.use("/api/v1", branch_routs);
app.use("/api/v1", website_roues);
//-- Middleware for err
const errMiddleware = require("./middleware/error");
app.use(errMiddleware);
module.exports = app;