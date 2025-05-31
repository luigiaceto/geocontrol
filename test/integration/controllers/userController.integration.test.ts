import * as userController from "@controllers/userController";
import { UserDAO } from "@dao/UserDAO";
import { UserType } from "@models/UserType";
import { UserRepository } from "@repositories/UserRepository";

// prepara il mock del UserRepository importato
jest.mock("@repositories/UserRepository");

describe("UserController integration", () => {
  // non viene mockato il mapperService
  it("getUser: mapperService integration", async () => {
    const fakeUserDAO: UserDAO = {
      username: "testuser",
      password: "secret",
      type: UserType.Operator
    };

    const expectedDTO = {
      username: fakeUserDAO.username,
      type: fakeUserDAO.type
    };

    // tra i metodi dell'UserRepository mocka il getUserByName() che tornerà
    // un oggetto che abbiamo precedentemente preparato.
    (UserRepository as jest.Mock).mockImplementation(() => ({
      getUserByUsername: jest.fn().mockResolvedValue(fakeUserDAO)
    }));

    const result = await userController.getUser("testuser");

    expect(result).toEqual({
      username: expectedDTO.username,
      type: expectedDTO.type
    });
    expect(result).not.toHaveProperty("password");
  });


  it("getAllUsers: mapperService integration", async () => {
    const fakeUserDAOs: UserDAO[] = [
      { username: "admin", password: "adminpass", type: UserType.Admin },
      { username: "viewer", password: "viewpass", type: UserType.Viewer }
    ];

    const expectedDTOs = [
      { username: "admin", type: UserType.Admin },
      { username: "viewer", type: UserType.Viewer }
    ];

    // Mock del metodo getAllUsers del repository
    (UserRepository as jest.Mock).mockImplementation(() => ({
      getAllUsers: jest.fn().mockResolvedValue(fakeUserDAOs)
    }));

    const result = await userController.getAllUsers();

    expect(result).toEqual(expectedDTOs);


    result.forEach(user => {
      expect(user).not.toHaveProperty("password");
    });
  });
});
