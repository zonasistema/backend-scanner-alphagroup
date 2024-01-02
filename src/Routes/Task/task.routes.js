import { Router } from "express";
import getTaskId from "../../controllers/Tasks/getTaskId.js";
import getTasks from "../../controllers/Tasks/getTasks.js";

const router = Router();

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await getTasks(req.query);

    res.send(tasks);
  } catch (error) {
    res.send({ msg: error.message });
  }
});

router.get("/:taskId", getTaskId);

export default router;
