import { Router } from "express";
import searchTask from "../../controllers/Search/searchTask.js";

const router = Router();

router.get("/", searchTask);

export default router;
