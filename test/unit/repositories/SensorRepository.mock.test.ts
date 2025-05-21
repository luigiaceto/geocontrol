import { SensorRepository } from "@repositories/SensorRepository";
import { SensorDAO } from "@dao/SensorDAO";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockRemove = jest.fn();

jest.mock("@database", () => ({
  AppDataSource: {
    getRepository: () => ({
      find: mockFind,
      save: mockSave,
      remove: mockRemove
    }),
  }
}));

describe("Sensor Repository: mocked database", () => {
  const repo = new SensorRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create sensor", async () => {
    mockFind.mockResolvedValue([]);

    const savedSensor = new SensorDAO();
    savedSensor.macAddress = '12:12:12:12';
    savedSensor.name = 's01';
    savedSensor.description = 'hi';
    savedSensor.variable = 'temperature';
    savedSensor.unit = '°C';
    savedSensor.gatewayId = 12;

    mockSave.mockResolvedValue(savedSensor);

    const result = await repo.createSensor('12:12:12:12', 's01', 'hi', 'temperature', '°C', 12);

    expect(result).toBeInstanceOf(SensorDAO);
    expect(result).toMatchObject({
      macAddress: '12:12:12:12',
      name: 's01',
      description: 'hi',
      variable: 'temperature',
      unit: '°C',
      gatewayId: 12
    });
    expect(mockSave).toHaveBeenCalledWith({
      macAddress: '12:12:12:12',
      name: 's01',
      description: 'hi',
      variable: 'temperature',
      unit: '°C',
      gatewayId: 12
    });
  });

  it("create sensor: conflict", async () => {
    const existingSensor = new SensorDAO();
    existingSensor.macAddress = '12:12:12:12';
    existingSensor.name = 's01';
    existingSensor.description = 'hi';
    existingSensor.variable = 'temperature';
    existingSensor.unit = '°C';
    existingSensor.gatewayId = 12;

    mockFind.mockResolvedValue([existingSensor]);

    await expect(
      repo.createSensor('12:12:12:12', 's02', 'hi', 'temperature', '°C', 12)
    ).rejects.toThrow(ConflictError);
  });

  it("get sensor by mac: NotFoundError", async () => {
    mockFind.mockResolvedValue([]);

    await expect(repo.getSensorByMac('12:12:12:12')).rejects.toThrow(
      NotFoundError
    );
  });

  it("get sensor by mac", async () => {
    const foundSensor = new SensorDAO();
    foundSensor.macAddress = '12:12:12:12';
    foundSensor.name = 's01';
    foundSensor.description = 'hi';
    foundSensor.variable = 'temperature';
    foundSensor.unit = '°C';
    foundSensor.gatewayId = 12;

    mockFind.mockResolvedValue([foundSensor]);

    const result = await repo.getSensorByMac('12:12:12:12');
    expect(result).toBe(foundSensor);
    expect(result.macAddress).toBe('12:12:12:12');
  });

  it("get sensor by gateway", async () => {
    const sensor1 = new SensorDAO();
    sensor1.macAddress = '12:12:12:12';
    sensor1.name = 's01';
    sensor1.description = 'hi';
    sensor1.variable = 'temperature';
    sensor1.unit = '°C';
    sensor1.gatewayId = 12;

    const sensor2 = new SensorDAO();
    sensor2.macAddress = '12:12:12:11';
    sensor2.name = 's02';
    sensor2.description = 'hi';
    sensor2.variable = 'temperature';
    sensor2.unit = '°C';
    sensor2.gatewayId = 12;

    mockFind.mockResolvedValue([sensor1, sensor2]);

    const result = await repo.getSensorsByGatewayId(12);
    
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(sensor1);
    expect(result).toContainEqual(sensor2);
    expect(mockFind).toHaveBeenCalledWith({ where: { gatewayId: 12 } });
  });

  it("update sensor: macAddress", async () => {
    const existingSensor = new SensorDAO();
    existingSensor.macAddress = '12:12:12:12';
    existingSensor.name = 's01';
    existingSensor.description = 'hi';
    existingSensor.variable = 'temperature';
    existingSensor.unit = '°C';
    existingSensor.gatewayId = 12;

    const updatedSensor = new SensorDAO();
    updatedSensor.macAddress = '12:12:12:13';
    updatedSensor.name = 's01';
    updatedSensor.description = 'hi';
    updatedSensor.variable = 'temperature';
    updatedSensor.unit = '°C';
    updatedSensor.gatewayId = 12;

    mockFind.mockResolvedValueOnce([existingSensor]);
    mockFind.mockResolvedValueOnce([]);
    
    mockSave.mockResolvedValueOnce(updatedSensor);

    const result = await repo.updateSensor('12:12:12:12', {
      macAddress: '12:12:12:13',
      name: 's01',
      description: 'hi',
      variable: 'temperature',
      unit: '°C'
    });

    expect(result.macAddress).toBe('12:12:12:13');
    expect(mockSave).toHaveBeenCalled();
  });

  it("update sensor: not-macAddress", async () => {
    const existingSensor = new SensorDAO();
    existingSensor.macAddress = '12:12:12:12';
    existingSensor.name = 's01';
    existingSensor.description = 'hi';
    existingSensor.variable = 'temperature';
    existingSensor.unit = '°C';
    existingSensor.gatewayId = 12;

    const updatedSensor = new SensorDAO();
    updatedSensor.macAddress = '12:12:12:12';
    updatedSensor.name = 's02';
    updatedSensor.description = 'hi';
    updatedSensor.variable = 'temperature';
    updatedSensor.unit = '°C';
    updatedSensor.gatewayId = 12;

    mockFind.mockResolvedValueOnce([existingSensor]);
    mockSave.mockResolvedValueOnce(updatedSensor);

    const result = await repo.updateSensor('12:12:12:12', {
      macAddress: '12:12:12:12',
      name: 's02',
      description: 'hi',
      variable: 'temperature',
      unit: '°C'
    });

    expect(result.name).toBe('s02');
    expect(mockSave).toHaveBeenCalled();
  });

  it("update sensor: conflict", async () => {
    const existingSensor = new SensorDAO();
    existingSensor.macAddress = '12:12:12:12';
    existingSensor.name = 's01';
    existingSensor.description = 'hi';
    existingSensor.variable = 'temperature';
    existingSensor.unit = '°C';
    existingSensor.gatewayId = 12;

    const conflictingSensor = new SensorDAO();
    conflictingSensor.macAddress = '12:12:12:13';

    mockFind.mockResolvedValueOnce([existingSensor]);
    mockFind.mockResolvedValueOnce([conflictingSensor]);

    await expect(
      repo.updateSensor('12:12:12:12', {
        macAddress: '12:12:12:13',
        name: 's01',
        description: 'hi',
        variable: 'temperature',
        unit: '°C'
      })
    ).rejects.toThrow(ConflictError);
  });

  it("delete sensor", async () => {
    const sensorToDelete = new SensorDAO();
    sensorToDelete.macAddress = '12:12:12:12';
    sensorToDelete.name = 's01';
    sensorToDelete.description = 'hi';
    sensorToDelete.variable = 'temperature';
    sensorToDelete.unit = '°C';
    sensorToDelete.gatewayId = 12;

    mockFind.mockResolvedValueOnce([sensorToDelete]);
    mockFind.mockResolvedValueOnce([sensorToDelete]);
    
    mockRemove.mockResolvedValueOnce(undefined);

    await repo.deleteSensor('12:12:12:12');

    expect(mockRemove).toHaveBeenCalledWith(sensorToDelete);
  });

  it("delete sensor: NotFoundError", async () => {
    mockFind.mockResolvedValue([]);

    await expect(repo.deleteSensor('12:12:12:12')).rejects.toThrow(
      NotFoundError
    );
  });
});