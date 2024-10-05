import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid req params");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    const formattedErrors: { message: string; field?: string }[] = [];
    this.errors.forEach((error) => {
      if (error.type === "field") {
        formattedErrors.push({ message: error.msg, field: error.path });
      }
    });
    return formattedErrors;
  }
}
