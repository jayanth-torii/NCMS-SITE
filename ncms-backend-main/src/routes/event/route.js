const express = require("express");
const router = express.Router();
const EventController = require("../../controllers/event/controller");

// Standard CRUD for the Event page content (singleton)
router.post("/events", EventController.createEvent);
router.get("/events", EventController.getEvent);
router.put("/events", EventController.updateEvent);
router.delete("/events", EventController.deleteEvent);

module.exports = router;
