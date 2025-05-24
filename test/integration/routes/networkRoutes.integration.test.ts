import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as networkController from "@controllers/networkController";
import { UserType } from "@models/UserType";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";

jest.mock("@services/authService");
jest.mock("@controllers/networkController");

describe("NetworkRoutes integration", () => {
  const token = "Bearer faketoken";
  const networkCode = "net1";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("get all networks", async () => {
    const mockNetworks = [
      { code: "net1", name: "Network 1", description: "Desc 1", gateways: [] },
      { code: "net2", name: "Network 2", description: "Desc 2", gateways: [] },
    ];

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.getAllNetworks as jest.Mock).mockResolvedValue(mockNetworks);

    const response = await request(app)
      .get("/api/v1/networks")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNetworks);
    expect(authService.processToken).toHaveBeenCalledWith(token, [
                UserType.Admin, UserType.Operator, UserType.Viewer
            ]);
    expect(networkController.getAllNetworks).toHaveBeenCalled();
  });

  it("get specific network", async () => {
    const mockNetwork = { code: networkCode, name: "Network 1", description: "Desc", gateways: [] };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.getNetwork as jest.Mock).mockResolvedValue(mockNetwork);

    const response = await request(app)
      .get(`/api/v1/networks/${networkCode}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNetwork);
    expect(networkController.getNetwork).toHaveBeenCalledWith(networkCode);
  });

  it("create network", async () => {
    const networkData = { code: "net3", name: "Network 3", description: "Desc 3" };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.createNetwork as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post("/api/v1/networks")
      .set("Authorization", token)
      .send(networkData);

    expect(response.status).toBe(201);
    expect(networkController.createNetwork).toHaveBeenCalled();
  });

  it("update network", async () => {
    const updatedData = { code: networkCode, name: "Updated", description: "Updated desc" };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.updateNetwork as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .patch(`/api/v1/networks/${networkCode}`)
      .set("Authorization", token)
      .send(updatedData);

    expect(response.status).toBe(204);
    expect(networkController.updateNetwork).toHaveBeenCalled();
  });

  it("delete network", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.deleteNetwork as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .delete(`/api/v1/networks/${networkCode}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(networkController.deleteNetwork).toHaveBeenCalledWith(networkCode);
  });

  it("get all networks: 401 UnauthorizedError from auth middleware", async () => {
    (authService.processToken as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedError("Unauthorized");
    });

    const response = await request(app)
      .get("/api/v1/networks")
      .set("Authorization", "Bearer invalid");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Unauthorized/);
  });

  it("create a network: 400 BadRequest from validator middleware", async () => {
    const invalidNetwork = { code: 123, name: "Invalid", description: "..." };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post("/api/v1/networks")
      .set("Authorization", token)
      .send(invalidNetwork);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/code/);
    expect(networkController.createNetwork).not.toHaveBeenCalled();
  });

  it("get all networks - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.getAllNetworks as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get("/api/v1/networks")
      .set("Authorization", token);

    expect(response.status).toBe(500);
  });

  it("get specific network - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.getNetwork as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get(`/api/v1/networks/${networkCode}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Test error/);
  });

  it("create network - error branch", async () => {
    const data = { code: "net3", name: "Network 3", description: "Desc 3" };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.createNetwork as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .post("/api/v1/networks")
      .set("Authorization", token)
      .send(data);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Test error/);
  });

  it("update network - error branch", async () => {
    const data = { code: networkCode, name: "Updated", description: "Updated" };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.updateNetwork as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .patch(`/api/v1/networks/${networkCode}`)
      .set("Authorization", token)
      .send(data);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Test error/);
  });

  it("delete network - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (networkController.deleteNetwork as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .delete(`/api/v1/networks/${networkCode}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Test error/);
  });
});
