import express from "express";
import { createEvent, getGroupEvents, joinEvent, requestJoin, handleRequest, getAllEvents, getEventRequests, deleteEvent } from "../controller/event.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/create", secureRoute, createEvent);
router.get("/group/:groupId", secureRoute, getGroupEvents);
// router.post("/join/:id", secureRoute, joinEvent); // Disabled for now in favor of request flow
router.post("/request/:id", secureRoute, requestJoin);
router.post("/handle-request/:id", secureRoute, handleRequest);
router.get("/all", secureRoute, getAllEvents);
router.get("/requests/:id", secureRoute, getEventRequests);
router.delete("/delete/:id", secureRoute, deleteEvent);

export default router;
