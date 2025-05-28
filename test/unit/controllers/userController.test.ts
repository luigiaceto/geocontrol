import * as userController from "@controllers/userController";
import { UserRepository } from "@repositories/UserRepository";
import { UserType } from "@models/UserType";
import { User } from "@dto/User";

// Mock del repository
jest.mock("@repositories/UserRepository");

describe("UserController", () => {
  it("createUser", async () => {
    const userDto: User = {
      username: "newuser",
      password: "strongpass",
      type: UserType.Operator
    };

    const mockRepo = {
      createUser: jest.fn().mockResolvedValue(undefined)
    };

    (UserRepository as jest.Mock).mockImplementation(() => mockRepo);

    await userController.createUser(userDto);

    expect(mockRepo.createUser).toHaveBeenCalledWith(
      userDto.username,
      userDto.password,
      userDto.type
    );
  });


  it("deleteUser", async () => {
    const username = "user";

    const mockRepo = {
      deleteUser: jest.fn().mockResolvedValue(undefined)
    };

    (UserRepository as jest.Mock).mockImplementation(() => mockRepo);

    await userController.deleteUser(username);

    expect(mockRepo.deleteUser).toHaveBeenCalledWith(username);
  });
});
