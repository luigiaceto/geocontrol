import { CONFIG } from "@config";
import AppError from "@models/errors/AppError";
import { Router } from "express";
import { UserType } from "@models/UserType";
import { authenticateUser } from "@middlewares/authMiddleware";
import { getMeasurementsOfSensor} from "@controllers/measurementController";
import { getStatsOfSensor } from "@controllers/measurementController";
import { getOutliersMeasurementsOfSensor } from "@controllers/measurementController";
import { getMeasurementsOfNetwork } from "@controllers/measurementController";
import { getStatsOfNetwork } from "@controllers/measurementController";
import { getOutliersMeasurementsOfNetwork } from "@controllers/measurementController";
import {  Measurement as MeasurementDTO, MeasurementFromJSON } from "@models/dto/Measurement";
import { storeMeasurement } from "@controllers/measurementController";
import { parseStringArrayParam } from "@utils";
const router = Router();

// Store a measurement for a sensor (Admin & Operator)
router.post(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements",
  authenticateUser([UserType.Admin, UserType.Operator]),
  async (req, res, next) => {
    try {
        //questa riga solo per assicurare che req.body sia un array anche se è presente una sola misurazione
        const body = Array.isArray(req.body) ? req.body : [req.body];
        const measurements : MeasurementDTO[] = body.map((json: any) => MeasurementFromJSON(json));

        await storeMeasurement(req.params.networkCode, req.params.gatewayMac, req.params.sensorMac, measurements);
        res.status(201).send();
      } catch (error) {
        next(error);
      }
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
  async (req, res, next) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const sensorMacs = req.query.sensorMacs ? parseStringArrayParam(req.query.sensorMacs) : undefined;

      const data = await getMeasurementsOfNetwork(
        req.params.networkCode, 
        sensorMacs, 
        startDate, 
        endDate);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve statistics for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/stats",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const sensorMacs = req.query.sensorMacs ? parseStringArrayParam(req.query.sensorMacs) : undefined;

      const data = await getStatsOfNetwork(req.params.networkCode, sensorMacs, startDate, endDate);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve only outliers for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/outliers",
  authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
  async (req, res, next) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const sensorMacs = req.query.sensorMacs ? parseStringArrayParam(req.query.sensorMacs) : undefined;

      const data = await getOutliersMeasurementsOfNetwork(
        req.params.networkCode, 
        sensorMacs, 
        startDate, 
        endDate);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);


export default router;
