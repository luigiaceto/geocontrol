import { getToken } from "@controllers/authController";
import { User as UserDTO } from "@dto/User";
import { UnauthorizedError } from "@errors/UnauthorizedError";
import { UserType } from "@models/UserType";
import { UserRepository } from "@repositories/UserRepository";

jest.mock("@repositories/UserRepository");
jest.mock("@services/authService", () => ({
  generateToken: jest.fn(() => "signedtoken"),
}));

describe("authController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a token for valid credentials", async () => {
    const userDto: UserDTO = { username: "user1", password: "pass"};
    const userDao = { username: "user1", password: "pass", type: UserType.Admin };

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getUserByUsername: jest.fn().mockResolvedValue(userDao),
    }));

    const result = await getToken(userDto);

    expect(result).toEqual({ token: "signedtoken" });
  });

  it("should throw UnauthorizedError for invalid password", async () => {
    const userDto: UserDTO = { username: "user1", password: "wrong"};
    const userDao = { username: "user1", password: "pass", UserType: UserType.Admin };

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getUserByUsername: jest.fn().mockResolvedValue(userDao),
    }));

    await expect(getToken(userDto)).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError if user does not exist", async () => {
    const userDto: UserDTO = { username: "notfound", password: "pass"};

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getUserByUsername: jest.fn().mockRejectedValue(new Error("User not found")),
    }));

    await expect(getToken(userDto)).rejects.toThrow();
  });
});