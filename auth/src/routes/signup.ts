import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user-model";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@dctiketz/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    const user = User.build({ email, password });
    await user.save();

    const jwtKey = process.env.JWT_KEY!;
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      jwtKey
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
