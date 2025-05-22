import {createErrorDTO, createTokenDTO,
    createUserDTO, mapUserDAOToDTO, createSensorDTO, mapSensorDAOToDTO, createGatewayDTO, mapGatewayDAOToDTO,
    createNetworkDTO, mapNetworkDAOToDTO, createStatsDTO, mapToStatsDTO, createMeasurementDTO, mapMeasurementDAOToDTO,createMeasurementsDTO, mapToMeasurementsDTO} from "@services/mapperService";
import { UserType } from "@models/UserType";

describe("mapperService", () => {
    it("createErrorDTO", async () => {
        const errorDTO = createErrorDTO(404, "Not Found", "NotFoundError");
        expect(errorDTO).toEqual({code: 404, message: "Not Found", name: "NotFoundError"});
    });

    it("createTokenDTO", async () => {
        const tokenDTO = createTokenDTO("abc123");
        expect(tokenDTO).toEqual({token: "abc123"});
    });

    it("createUserDTO", async () => {
        const userDTO = createUserDTO("user1", "admin", "password123");
        expect(userDTO).toEqual({username: "user1", type: "admin", password: "password123"});
    });

    it("mapUserDAOToDTO", async () => {
        const userDAO = {username: "user1", type: UserType.Admin, password: "password123"};
        const userDTO = mapUserDAOToDTO(userDAO);
        expect(userDTO).toEqual({username: "user1", type: UserType.Admin});
    });

    it("createSensorDTO", async () => {
        const sensorDTO = createSensorDTO("11:22:33:44:55:66", "sensore Temperatura", "misura Temperatura", "temperatura", "C");
        expect(sensorDTO).toEqual({macAddress: "11:22:33:44:55:66",name: "sensore Temperatura",description: "misura Temperatura",variable: "temperatura",unit: "C"});
    });

     it("mapSensorDAOToDTO", async () => {
        // Create a valid SensorDAO instance with required properties
        const sensorDAO = {
            id: 1,
            macAddress: "11:22:33:44:55:66",
            name: "sensore Temperatura",
            description: "misura Temperatura",
            variable: "temperatura",
            unit: "C",
            gatewayId: 1,
            gateway: undefined,
            measurements: []
        };
        const sensorDTO = mapSensorDAOToDTO(sensorDAO);
        expect(sensorDTO).toEqual({macAddress: "11:22:33:44:55:66", name: "sensore Temperatura", description: "misura Temperatura", variable: "temperatura", unit: "C"});
    });

    it("createGatewayDTO", async () => {
        const gatewayDTO = createGatewayDTO(
            "22:33:44:55:66:77",
            "Gateway 1",
            "Description",
            [
                {macAddress: "11:22:33:44:55:66", name: "sensore Temperatura", description: "misura Temperatura", variable: "temperatura", unit: "C"}
            ]
        );
        expect(gatewayDTO).toEqual({macAddress: "22:33:44:55:66:77", name: "Gateway 1", description: "Description", sensors: [
                {macAddress: "11:22:33:44:55:66", name: "sensore Temperatura", description: "misura Temperatura", variable: "temperatura", unit: "C"}
            ]});
    });

    it("mapGatewayDAOToDTO", async () => {
        const gatewayDAO = {
            id: 1,
            macAddress: "22:33:44:55:66:77",
            name: "Gateway 1",
            description: "Description",
            networkId: 1,
            network: undefined,
            sensors: [
                {
                    id: 1,
                    macAddress: "11:22:33:44:55:66",
                    name: "sensore Temperatura",
                    description: "misura Temperatura",
                    variable: "temperatura",
                    unit: "C",
                    gatewayId: 1,
                    gateway: undefined,
                    measurements: []
                }
            ]
        };
        const gatewayDTO = mapGatewayDAOToDTO(gatewayDAO);
        expect(gatewayDTO).toEqual({macAddress: "22:33:44:55:66:77", name: "Gateway 1", description: "Description", sensors:[
                {macAddress: "11:22:33:44:55:66", name: "sensore Temperatura", description: "misura Temperatura", variable: "temperatura", unit: "C"}
            ]});
    });

    it("createNetworkDTO", async () => {
        const networkDTO = createNetworkDTO("NET1","Network 1","Description",
            [
                {macAddress: "22:33:44:55:66:77", name: "Gateway 1", description: "Description", sensors: [
                    {macAddress: "11:22:33:44:55:66", name: "sensore Temperatura", description: "misura Temperatura", variable: "temperatura", unit: "C"}
                ]}
            ]
        );
        expect(networkDTO).toEqual({code: "NET1", name: "Network 1", description: "Description", gateways:[
                {macAddress: "22:33:44:55:66:77", name: "Gateway 1", description: "Description", sensors: [
                    {macAddress: "11:22:33:44:55:66", name: "sensore Temperatura", description: "misura Temperatura", variable: "temperatura", unit: "C"}
                ]}
            ]});
    });

    it("mapNetworkDAOToDTO", async () => {
        const networkDAO = {
            id: 1, 
            code: "NET1",
            name: "Network 1",
            description: "Description",
            gateways: [
                {
                    id: 1,
                    macAddress: "22:33:44:55:66:77",
                    name: "Gateway 1",
                    description: "Description",
                    networkId: 1,
                    network: undefined,
                    sensors: [
                        {
                            id: 1,
                            macAddress: "11:22:33:44:55:66",
                            name: "sensore Temperatura",
                            description: "misura Temperatura",
                            variable: "temperatura",
                            unit: "C",
                            gatewayId: 1,
                            gateway: undefined,
                            measurements: []
                        }
                    ]
                }
            ]
        };
        const networkDTO = mapNetworkDAOToDTO(networkDAO);
        expect(networkDTO).toEqual({code:"NET1", name:"Network 1", description:"Description", gateways:[
                {macAddress:"22:33:44:55:66:77", name:"Gateway 1", description:"Description", sensors:[
                    {macAddress:"11:22:33:44:55:66", name:"sensore Temperatura", description:"misura Temperatura", variable:"temperatura", unit:"C"}
                ]}
            ]});
    });

    // controllare ordine lower e upper threshold
    it("createStatsDTO", async () => {
        const statsDTO = createStatsDTO(new Date("2025-05-21"),new Date("2025-05-22"),1,2,4,3);
        expect(statsDTO).toEqual({startDate: new Date("2025-05-21"), endDate: new Date("2025-05-22"), mean: 1, variance: 2, lowerThreshold: 3, upperThreshold: 4});
    });

    it("mapToStatsDTO", async () => {
        const dto = mapToStatsDTO(new Date("2024-01-01"), new Date("2024-01-02"), 1, 2, 3, 4);
        expect(dto).toMatchObject({
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-01-02"),
            mean: 1,
            variance: 2,
            upperThreshold: 3,
            lowerThreshold: 4
        });
    });

    it("createMeasurementDTO", async () => {
        const measurementDTO = createMeasurementDTO(new Date("2025-05-21"), 42, true);
        expect(measurementDTO).toEqual({createdAt: new Date("2025-05-21"), value: 42, isOutlier: true});
    });

    it("createMeasurementDTO senza isOutlier", async () => {
        const measurementDTO = createMeasurementDTO(new Date("2025-05-21"), 42);
        expect(measurementDTO).toEqual({createdAt: new Date("2025-05-21"), value: 42});
    });

    it("mapMeasurementDAOToDTO", async () => {
        const measurementDAO = {
            id: 1,
            createdAt: new Date("2025-05-21"),
            value: 42,
            sensorId: 1,
            sensor: undefined
        };
        const lowerThreshold = 10;
        const upperThreshold = 50;
        const measurementDTO = mapMeasurementDAOToDTO(measurementDAO, lowerThreshold, upperThreshold);
        expect(measurementDTO).toEqual({createdAt: new Date("2025-05-21"), value: 42, isOutlier: false});
    });

    it("mapMeasurementDAOToDTO con outlier", () => {
        const measurementDAO = { id:1, createdAt: new Date("2025-05-21"), value: 100, sensorId:1, sensor: undefined };
        const lowerThreshold = 10;
        const upperThreshold = 50;
        const dto = mapMeasurementDAOToDTO(measurementDAO, lowerThreshold, upperThreshold);
        expect(dto).toEqual({ createdAt: new Date("2025-05-21"), value: 100, isOutlier: true });
    });

    it("createMeasurementsDTO", async () => {
    const statsDTO = createStatsDTO(new Date("2025-05-21"), new Date("2025-05-22"), 1, 2, 3, 4);
    const measurements = [createMeasurementDTO(new Date("2025-05-21"), 42)];
    const measurementsDTO = createMeasurementsDTO("11:22:33:44:55:66", statsDTO, measurements);
    expect(measurementsDTO).toEqual({
        sensorMac: "11:22:33:44:55:66",
        stats: statsDTO,
        measurements: [{ createdAt: new Date("2025-05-21"), value: 42 }]
    });
});

    describe("mapToMeasurementsDTO", () => {
        const sensorMac = "11:22:33:44:55:66";
        const startDate = new Date("2025-05-21");
        const endDate = new Date("2025-05-22");
        const mean = 1, variance = 2, upperThreshold = 50, lowerThreshold = 10;

        it("gestisce measurements undefined (solo stats)", () => {
        const dto = mapToMeasurementsDTO(sensorMac, startDate, endDate, mean, variance, upperThreshold, lowerThreshold, undefined);

        expect(dto).toMatchObject({
            sensorMac,
            stats: {
            startDate,
            endDate,
            mean,
            variance,
            upperThreshold,
            lowerThreshold
            }
        });

        expect(dto.measurements ?? []).toEqual([]); // fallback nel test
        });

        it("gestisce measurements array vuoto", () => {
            const dto = mapToMeasurementsDTO(sensorMac, startDate, endDate, mean, variance, upperThreshold, lowerThreshold, []);
            expect(dto).toMatchObject({
            sensorMac,
            stats: {
                startDate,
                endDate,
                mean,
                variance,
                upperThreshold,
                lowerThreshold
            }
            });
            expect(dto.measurements ?? []).toEqual([]);
        });

        it("gestisce measurements array non vuoto", () => {
            const measurements = [
            { id: 1, createdAt: startDate, value: 42, sensorId: 1, sensor: undefined }
            ];
            const dto = mapToMeasurementsDTO(sensorMac, startDate, endDate, mean, variance, upperThreshold, lowerThreshold, measurements);
            expect(dto).toEqual({
            sensorMac,
            stats: {
                startDate,
                endDate,
                mean,
                variance,
                upperThreshold,
                lowerThreshold
            },
            measurements: [
                { createdAt: startDate, value: 42, isOutlier: false }
            ]
            });
        });
    });

 

});