import { authenticateUser } from "@middlewares/authMiddleware";
import { processToken } from "@services/authService";
import { UserType } from "@models/UserType";

jest.mock("@services/authService", () => ({
  processToken: jest.fn(),
}));

describe("authenticateUser middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: { authorization: "Bearer faketoken" } };
    res = {};
    next = jest.fn();
    (processToken as jest.Mock).mockClear();
  });

  it("should call processToken with correct arguments and call next on success", async () => {
    (processToken as jest.Mock).mockResolvedValue(undefined);

    const middleware = authenticateUser([UserType.Admin]);
    await middleware(req, res, next);

    expect(processToken).toHaveBeenCalledWith("Bearer faketoken", [UserType.Admin]);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with error if processToken throws", async () => {
    const error = new Error("Unauthorized");
    (processToken as jest.Mock).mockRejectedValue(error);

    const middleware = authenticateUser([UserType.Operator]);
    await middleware(req, res, next);

    expect(processToken).toHaveBeenCalledWith("Bearer faketoken", [UserType.Operator]);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should use empty array for allowedRoles if not provided", async () => {
    (processToken as jest.Mock).mockResolvedValue(undefined);

    const middleware = authenticateUser();
    await middleware(req, res, next);

    expect(processToken).toHaveBeenCalledWith("Bearer faketoken", []);
    expect(next).toHaveBeenCalledWith();
  });

  it("should handle missing authorization header", async () => {
    req = { headers: {} };
    const error = new Error("No token");
    (processToken as jest.Mock).mockRejectedValue(error);

    const middleware = authenticateUser([UserType.Admin]);
    await middleware(req, res, next);

    expect(processToken).toHaveBeenCalledWith(undefined, [UserType.Admin]);
    expect(next).toHaveBeenCalledWith(error);
  });
});