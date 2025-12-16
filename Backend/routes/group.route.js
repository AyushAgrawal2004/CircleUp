import express from "express";
import { createGroup, getGroups, getGroup, joinGroup, getMyGroups } from "../controller/group.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/create", secureRoute, createGroup);
router.get("/all", secureRoute, getGroups);
router.get("/my", secureRoute, getMyGroups); // Get groups I'm a member of
router.get("/:id", secureRoute, getGroup);
router.post("/join/:id", secureRoute, joinGroup);

export default router;
