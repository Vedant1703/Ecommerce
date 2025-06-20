import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes import

import userRouter from './routes/user.routes.js';


// router declaration
app.use("/api/v1/users", userRouter);



export {app};