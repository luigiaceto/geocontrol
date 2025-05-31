import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as gatewayController from "@controllers/gatewayController";
import { UserType } from "@models/UserType";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";

jest.mock("@services/authService");
jest.mock("@controllers/gatewayController");


describe("GatewayRoutes integration", () => {
    const token="Bearer faketoken";
    const networkCode="net1";
    const gatewayMac="gw1";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get all gateways", async () => {
        const mockGateways = [
            { macAddress: "gw1", name: "Gateway 1", description: "gateway 1", sensors:[]},
            { macAddress: "gw2", name: "Gateway 2", description: "gateway 2", sensors:[]}
        ];

        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.getAllGateways as jest.Mock).mockResolvedValue(mockGateways);


        const response = await request(app)
            .get(`/api/v1/networks/${networkCode}/gateways`)
            .set("Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockGateways);
        expect(authService.processToken).toHaveBeenCalledWith(token, [
            UserType.Admin, UserType.Operator, UserType.Viewer
        ]);
        expect(gatewayController.getAllGateways).toHaveBeenCalledWith(networkCode);

    });

    it("get a specific gateway", async () => {
        const mockGateway = { macAddress: gatewayMac, name: "Gateway 1", description: "gateway 1", sensors:[]};

        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.getGateway as jest.Mock).mockResolvedValue(mockGateway);

        const response = await request(app)
            .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}`)
            .set("Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockGateway);
        expect(gatewayController.getGateway).toHaveBeenCalledWith(networkCode, gatewayMac);
    });

    it("create a gateway", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.createGateway as jest.Mock).mockResolvedValue(undefined);

        const gatewayData = { macAddress: "gw3", name: "Gateway 3", description: "gateway 3" };

        const response = await request(app)
            .post(`/api/v1/networks/${networkCode}/gateways`)
            .set("Authorization", token)
            .send(gatewayData);

        expect(response.status).toBe(201);
        expect(gatewayController.createGateway).toHaveBeenCalled();
    });

    it("update a gateway", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.updateGateway as jest.Mock).mockResolvedValue(undefined);

        const gatewayData = { macAddress: "gw1", name: "Updated Gateway", description: "Updated description" };

        const response = await request(app)
            .patch(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}`)
            .set("Authorization", token)
            .send(gatewayData);

        expect(response.status).toBe(204);
        expect(gatewayController.updateGateway).toHaveBeenCalled();
    });

    it("delete a gateway", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.deleteGateway as jest.Mock).mockResolvedValue(undefined);

        const response = await request(app)
            .delete(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}`)
            .set("Authorization", token);

        expect(response.status).toBe(204);
        expect(gatewayController.deleteGateway).toHaveBeenCalledWith(networkCode, gatewayMac);
    });

    it("get all gateways: 401 UnauthorizedError from auth middleware", async () => {
        (authService.processToken as jest.Mock).mockImplementation(() => {
            throw new UnauthorizedError("Unauthorized: No token provided");
        });

        const response = await request(app)
            .get(`/api/v1/networks/${networkCode}/gateways`)
            .set("Authorization", "Bearer invalid");

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/);
    });

    it("create a gateway: 400 BadRequest from validator middleware", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.createGateway as jest.Mock).mockImplementation(undefined);

        const invalidGatewayData = { macAddress: 123, name: "Gateway 3", description: "gateway 3" };

        const response = await request(app)
            .post(`/api/v1/networks/${networkCode}/gateways`)
            .set("Authorization", token)
            .send(invalidGatewayData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toMatch(/macAddress/);
        expect(gatewayController.createGateway).not.toHaveBeenCalled();
    });

    it("get all gateways - error branch", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.getAllGateways as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
        });
        
        const res = await request(app)
        .get(`/api/v1/networks/${networkCode}/gateways`)
        .set("Authorization", token);
        
        expect(res.status).toBe(500); 
    });

    it("get a specific gateway - error branch", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.getGateway as jest.Mock).mockImplementation(() => {
            throw new Error("Test error");
        });

        const response = await request(app)
            .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}`)
            .set("Authorization", token);

        expect(response.status).toBe(500);
        expect(response.body.message).toMatch(/Test error/);
    });

    it("create a gateway - error branch", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.createGateway as jest.Mock).mockImplementation(() => {
            throw new Error("Test error");
        });

        const gatewayData = { macAddress: "gw3", name: "Gateway 3", description: "gateway 3" };

        const response = await request(app)
            .post(`/api/v1/networks/${networkCode}/gateways`)
            .set("Authorization", token)
            .send(gatewayData);

        expect(response.status).toBe(500);
        expect(response.body.message).toMatch(/Test error/);
    });

    it("update a gateway - error branch", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.updateGateway as jest.Mock).mockImplementation(() => {
            throw new Error("Test error");
        });

        const gatewayData = { macAddress: gatewayMac, name: "Updated", description: "Updated" };

        const response = await request(app)
            .patch(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}`)
            .set("Authorization", token)
            .send(gatewayData);

        expect(response.status).toBe(500);
        expect(response.body.message).toMatch(/Test error/);
    });


    it("delete a gateway - error branch", async () => {
        (authService.processToken as jest.Mock).mockResolvedValue(undefined);
        (gatewayController.deleteGateway as jest.Mock).mockImplementation(() => {
            throw new Error("Test error");
        });

        const response = await request(app)
            .delete(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}`)
            .set("Authorization", token);

        expect(response.status).toBe(500);
        expect(response.body.message).toMatch(/Test error/);
    });



});
