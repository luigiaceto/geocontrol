import { createAppError } from "@services/errorService";
import { AppError } from "@errors/AppError";

jest.mock("@services/loggingService", () => ({
  logError: jest.fn(),
}));
jest.mock("@services/mapperService", () => ({
  createErrorDTO: jest.requireActual("@services/mapperService").createErrorDTO,
}));

describe("createAppError", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a generic 500 error for a plain error object", () => {
    const err = new Error("Something went wrong");
    const result = createAppError(err);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Something went wrong");
    expect(result.name).toBe("InternalServerError");
  });

  it("should return a specific error for AppError", () => {
    const err = new AppError("Custom error", 418);
    err.name = "TeapotError";
    const result = createAppError(err);

    expect(result.code).toBe(418);
    expect(result.message).toBe("Custom error");
    expect(result.name).toBe("TeapotError");
  });

  it("should handle error-like objects with status and message", () => {
    const err = { status: 404, message: "Not found", name: "NotFoundError" };
    const result = createAppError(err);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Not found");
    expect(result.name).toBe("NotFoundError");
  });

  it("should handle error with missing message", () => {
    const err = {};
    const result = createAppError(err);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal Server Error");
    expect(result.name).toBe("InternalServerError");
  });

  it("should log the error", () => {
    const { logError } = require("@services/loggingService");
    const err = new Error("Log test");
    createAppError(err);

    expect(logError).toHaveBeenCalled();
  });

  
});