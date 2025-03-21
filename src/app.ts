import { CONFIG } from "@config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

export const app = express();

app.use(express.json());

app.use(
  CONFIG.ROUTES.V1_SWAGGER,
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(CONFIG.SWAGGER_V1_FILE_PATH))
);
