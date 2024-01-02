import { Router } from "express";
import getDrivers from "../../controllers/Drivers/getDrivers.js";

const router = Router();

router.get("/", getDrivers);

export default router;
