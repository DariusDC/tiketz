import { currentUserMiddleware } from "@dctiketz/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserMiddleware,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
