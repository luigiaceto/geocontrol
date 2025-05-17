import { CONFIG } from "@config";
import AppError from "@models/errors/AppError";
import { Router } from "express";
import { UserType } from "@models/UserType";
import { authenticateUser } from "@middlewares/authMiddleware";
import { 
  getMeasurementsOfSensor
 } from "@controllers/measurementController";
import { getStatsOfSensor } from "@controllers/measurementController";
import { getOutliersMeasurementsOfSensor } from "@controllers/measurementController";
const router = Router();

// Store a measurement for a sensor (Admin & Operator)
router.post(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements",
  authenticateUser([UserType.Admin, UserType.Operator]),
  (req, res, next) => {
    throw new AppError("Method not implemented", 500);
  }
);

// Retrieve measurements for a specific sensor
router.get(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    try {
      res.status(200).json(await getMeasurementsOfSensor(
        req.params.networkCode,
        req.params.gatewayMac,
        req.params.sensorMac,
        startDate,
        endDate
      ));
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve statistics for a specific sensor
router.get(CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/stats",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    try {
      res.status(200).json(await getStatsOfSensor(
        req.params.networkCode,
        req.params.gatewayMac,
        req.params.sensorMac,
        startDate,
        endDate
      ));
    } catch (error) {
      next(error);
    }
});

// Retrieve only outliers for a specific sensor
router.get(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/outliers",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    try {
      res.status(200).json(await getOutliersMeasurementsOfSensor(
        req.params.networkCode,
        req.params.gatewayMac,
        req.params.sensorMac,
        startDate,
        endDate
      ));
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve measurements for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/measurements",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  (req, res, next) => {


    throw new AppError("Method not implemented", 500);
  }
);

// Retrieve statistics for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/stats",
  (req, res, next) => {
    throw new AppError("Method not implemented", 500);
  }
);

// Retrieve only outliers for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/outliers",
  (req, res, next) => {
    throw new AppError("Method not implemented", 500);
  }
);

export default router;
