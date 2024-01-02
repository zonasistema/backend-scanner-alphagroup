import { Router } from "express";

import task_routes from "./Task/task.routes.js";
import driver_routes from "./Driver/driver.routes.js";
import history_routes from "./HistoryTask/taskHistory.routes.js";
import search_routes from "./Search/search.routes.js";

const router = Router();

router.use("/task", task_routes);

router.use("/drivers", driver_routes);

router.use("/history", history_routes);

router.use("/search", search_routes);

export default router;
