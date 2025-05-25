export const TEST_NETWORKS = {
  network01: { code: "net01", name: "Network01", description: "Network01 Description" },
  network02: { code: "net02", name: "Network02", description: "Network02 Description" },
  network03: { code: "net03", name: "Network03", description: "Network03 Description" }
};

export const TEST_GATEWAYS = {
  gateway01: { macAddress: "AA:BB:CC:DD:EE:FF", name: "Gateway01", description: "Gateway01 Description" },
  gateway02: { macAddress: "FF:EE:DD:CC:BB:AA", name: "Gateway02", description: "Gateway02 Description" },
  gateway03: { macAddress: "11:22:33:44:55:66", name: "Gateway03", description: "Gateway03 Description" },
  gateway04: { macAddress: "00:11:00:11:00:11", name: "Gateway04", description: "Gateway04 Description" }
};

export const TEST_SENSORS = {
  sensor01: { macAddress: "11:22:33:44:55:66", name: "Sensor01", description: "Sensor01 Description", variable: "temp", unit: "C" },
  sensor02: { macAddress: "66:55:44:33:22:11", name: "Sensor02", description: "Sensor02 Description", variable: "humidity", unit: "%" },
  sensor03: { macAddress: "AA:BB:CC:DD:EE:01", name: "Sensor03", description: "Sensor03 Description", variable: "pressure", unit: "hPa" },
  sensor04: { macAddress: "FF:EE:DD:a:a:a", name: "Sensor04", description: "Sensor04 Description", variable: "light", unit: "lux" }
};

// 2023-10-02T02:00:00+01:00 significa che si è 1 ora avanti rispetto a UTC -> 2023-10-02T01:00:00Z
export const TEST_MEASUREMENTS = {
  measurement01: { sensorMacAddress: "11:22:33:44:55:66", value: 25.5, createdAt: new Date("2023-10-01T01:00:00+01:00") },
  measurement02: { sensorMacAddress: "66:55:44:33:22:11", value: 60, createdAt: new Date("2023-10-01T01:00:00+01:00") },
  measurement03: { sensorMacAddress: "11:22:33:44:55:66", value: 26.0, createdAt: new Date("2023-10-02T01:00:00+01:00") },
  measurement04: { sensorMacAddress: "66:55:44:33:22:11", value: 65, createdAt: new Date("2023-10-03T01:00:00+01:00") },
  measurement05: { sensorMacAddress: "11:22:33:44:55:66", value: 27.0, createdAt: new Date("2023-10-03T01:00:00+01:00") },
  measurement06: { sensorMacAddress: "66:55:44:33:22:11", value: 10000, createdAt: new Date("2023-10-04T01:00:00+01:00") }
};

export const TEST_MEASUREMENTS_OUTLIER = {
  measurement01: { value: 10, createdAt: new Date("2025-02-18T17:00:00+01:00") },
  measurement02: { value: 11, createdAt: new Date("2025-02-18T17:00:00+01:00") },
  measurement03: { value: 12, createdAt: new Date("2025-02-18T17:00:00+01:00") },
  measurement04: { value: 12, createdAt: new Date("2025-02-18T17:00:00+01:00") },
  measurement05: { value: 13, createdAt: new Date("2025-02-18T17:00:00+01:00") },
  measurement06: { value: 30, createdAt: new Date("2025-02-18T17:00:00+01:00") }
};