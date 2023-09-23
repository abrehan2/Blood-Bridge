// PARTIALS -
interface ErrorTypes {
  message: string;
  status: number;
}

class ErrorHandler extends Error {
  status: number;

  constructor({ message, status }: ErrorTypes) {
    super(message);
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}
