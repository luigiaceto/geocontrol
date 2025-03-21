import path = require("path");

const APP_V1_BASE_URL = "/api/v1";

export const CONFIG = {
  APP_PORT: process.env.PORT || 5000,
  SWAGGER_V1_FILE_PATH: path.resolve(__dirname, "../../doc/swagger_v1.yaml"),
  ROUTES: {
    V1_SWAGGER: APP_V1_BASE_URL + "/doc"
  },
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_PATH: process.env.LOG_PATH || "logs",
  ERROR_LOG_FILE: process.env.ERROR_LOG_FILE || "error.log",
  COMBINED_LOG_FILE: process.env.COMBINED_LOG_FILE || "combined.log"
};
