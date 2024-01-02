import { Router } from "express";
import getTaskHistory from "../../controllers/HistoryTask/getTaskHistory.js";

const router = Router();

router.get("/:historyId", getTaskHistory);

export default router;
