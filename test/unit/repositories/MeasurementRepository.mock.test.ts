import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";

const mockFind = jest.fn();
const mockSave = jest.fn();

jest.mock("@database", () => ({
  AppDataSource: {
    getRepository: () => ({
      find: mockFind,
      save: mockSave
    }),
  }
}));

describe("Measurement Repository: mocked database", () => {
  const repo = new MeasurementRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getMeasurementsBySensorId: no start/end", async () => {
    const measurement = new MeasurementDAO();
    measurement.sensorId = 1;
    measurement.value = 10;
    measurement.createdAt = new Date("2024-01-01");
    

    mockFind.mockResolvedValue([measurement]);

    const result = await repo.getMeasurementsBySensorId(1, undefined, undefined);
    expect(result).toEqual([measurement]);
    expect(mockFind).toHaveBeenCalledWith({ where: { sensorId: 1 } });
  });

  it("getMeasurementsBySensorId: only start", async () => {
    const measurement = new MeasurementDAO();
    measurement.sensorId = 1;
    measurement.value = 10;
    measurement.createdAt = new Date("2024-01-01");

    mockFind.mockResolvedValue([measurement]);
    const start = new Date("2024-01-01");

    const result = await repo.getMeasurementsBySensorId(1, start, undefined);
    expect(result).toEqual([measurement]);
    expect(mockFind).toHaveBeenCalledWith({
      where: {
        sensorId: 1,
        createdAt: expect.objectContaining({ type: "moreThanOrEqual", value: start })
      }
    });
  });

  it("getMeasurementsBySensorId: only end", async () => {
    const measurement = new MeasurementDAO();
    measurement.sensorId = 1;
    measurement.value = 10;
    measurement.createdAt = new Date("2024-01-01");

    mockFind.mockResolvedValue([measurement]);
    const end = new Date("2024-01-02");

    const result = await repo.getMeasurementsBySensorId(1, undefined, end);
    expect(result).toEqual([measurement]);
    expect(mockFind).toHaveBeenCalledWith({
      where: {
        sensorId: 1,
        createdAt: expect.objectContaining({ type: "lessThanOrEqual", value: end })
      }
    });
  });

  it("getMeasurementsBySensorId: start and end", async () => {
    const measurement = new MeasurementDAO();
    measurement.sensorId = 1;
    measurement.value = 10;
    measurement.createdAt = new Date("2024-01-02");

    mockFind.mockResolvedValue([measurement]);
    const start = new Date("2024-01-01");
    const end = new Date("2024-01-03");

    const result = await repo.getMeasurementsBySensorId(1, start, end);
    expect(result).toEqual([measurement]);
    expect(mockFind).toHaveBeenCalledWith({
      where: {
        sensorId: 1,
        createdAt: expect.objectContaining({ type: "between", value: [start, end] })
      }
    });
  });

  it("storeMeasurement", async () => {
    const measurement = new MeasurementDAO();
    measurement.sensorId = 1;
    measurement.value = 10;
    measurement.createdAt = new Date("2024-01-01");

    mockSave.mockResolvedValue(measurement);

    const result = await repo.storeMeasurement(measurement.createdAt, measurement.value, measurement.sensorId);
    expect(result).toBe(measurement);
    expect(mockSave).toHaveBeenCalledWith({
      createdAt: measurement.createdAt,
      value: measurement.value,
      sensorId: measurement.sensorId
    });
  });

  
});