import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Key is not set");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo db (auth)");
  } catch (e) {
    console.error("Error starting auth db", e);
  }

  app.listen(3000, () => console.log("Auth started on 3000!!!"));
};

start();
