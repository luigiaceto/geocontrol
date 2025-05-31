import { UserRepository } from "@repositories/UserRepository";
import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { UserType } from "@models/UserType";
import { UserDAO } from "@dao/UserDAO";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";

beforeAll(async () => {
  await initializeTestDataSource();
});

afterAll(async () => {
  await closeTestDataSource();
});

beforeEach(async () => {
  await TestDataSource.getRepository(UserDAO).clear();
});

// fruttano un DB in-memory, non vengono mockate le funzioni
describe("UserRepository: SQLite in-memory", () => {
  const repo = new UserRepository();

  it("create user", async () => {
    const user = await repo.createUser("john", "pass123", UserType.Admin);
    expect(user).toMatchObject({
      username: "john",
      password: "pass123",
      type: UserType.Admin
    });

    const found = await repo.getUserByUsername("john");
    expect(found.username).toBe("john");
  });

  it("find user by username: not found", async () => {
    await expect(repo.getUserByUsername("ghost")).rejects.toThrow(
      NotFoundError
    );
  });

  it("create user: conflict", async () => {
    await repo.createUser("john", "pass123", UserType.Admin);
    await expect(
      repo.createUser("john", "anotherpass", UserType.Viewer)
    ).rejects.toThrow(ConflictError);
  });

  it("get all users", async () => {
    await repo.createUser("john", "pass123", UserType.Admin);
    await repo.createUser("simon", "pass23", UserType.Admin);
    const result = await repo.getAllUsers(); 
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      username: "john",
      password: "pass123",
      type: UserType.Admin
    });
    expect(result).toContainEqual({
      username: "simon",
      password: "pass23",
      type: UserType.Admin
    });
  });
});
