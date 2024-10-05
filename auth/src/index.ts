import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Key is not set");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongo db (auth)");
  } catch (e) {
    console.error("Error starting auth db", e);
  }

  app.listen(3000, () => console.log("Auth started on 3000!!!"));
};

start();
