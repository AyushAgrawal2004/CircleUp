import express from "express";
import multer from "multer";
import { createStatus, getGroupStatuses, viewStatus, deleteStatus } from "../controller/status.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Memory storage for Buffer access
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", secureRoute, upload.single("file"), createStatus);
router.get("/group/:groupId", secureRoute, getGroupStatuses);
router.post("/view/:id", secureRoute, viewStatus);
router.delete("/delete/:id", secureRoute, deleteStatus);

export default router;
