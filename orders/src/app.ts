import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import {
  currentUserMiddleware,
  errorHandler,
  NotFoundError,
} from "@dctiketz/common";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";
import { createOrderRouter } from "./routes/new";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserMiddleware);

app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler as any);

export { app };
