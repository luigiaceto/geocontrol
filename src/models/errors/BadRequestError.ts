import { AppError } from "@errors/AppError";

// creato manualmente per gestire i casi in cui viene omesso
// un campo required, il validator automatico non riconosce
// l'omissione di campi required
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequest";
  }
}