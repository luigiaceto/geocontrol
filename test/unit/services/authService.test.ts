import { processToken } from "@services/authService";
import { UserType } from "@models/UserType";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";
import { InsufficientRightsError } from "@models/errors/InsufficientRightsError";
import { TOKEN_LIFESPAN, SECRET_KEY } from "@config";
import jwt from "jsonwebtoken";

jest.mock("@repositories/UserRepository", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      getUserByUsername: jest.fn(async (username) => {
        if (username === "existingUser") {
          return { username: "existingUser", type: UserType.Admin };
        }
        throw new Error("User not found");
      }),
    })),
  };
});

describe("authService", () => {
  const validUser = { username: "existingUser", type: UserType.Admin };
  const validToken = jwt.sign(validUser, SECRET_KEY, { expiresIn: TOKEN_LIFESPAN });

  it("should throw UnauthorizedError if user is not found", async () => {
    const user = { username: "notFound", type: UserType.Admin };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: TOKEN_LIFESPAN });
    await expect(processToken(`Bearer ${token}`)).rejects.toThrow(UnauthorizedError);
  });

  it("should throw InsufficientRightsError if user has insufficient rights", async () => {
    await expect(
      processToken(`Bearer ${validToken}`, [UserType.Operator])
    ).rejects.toThrow(InsufficientRightsError);
  });

  it("should throw UnauthorizedError if no token is provided", async () => {
    await expect(processToken(undefined)).rejects.toThrow(UnauthorizedError);
    await expect(processToken("")).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError if token format is invalid", async () => {
    await expect(processToken("InvalidTokenFormat")).rejects.toThrow(UnauthorizedError);
    await expect(processToken("Bearer")).rejects.toThrow(UnauthorizedError);
    await expect(processToken("Bearer too many parts here")).rejects.toThrow(UnauthorizedError);
  });
});