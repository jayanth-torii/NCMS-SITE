const express = require("express");
const router = express.Router();
const ValueAddedCourseController = require("../../controllers/value-added-course/controller");

// Standard CRUD for the ValueAddedCourse page content (singleton)
router.post("/value-added-course", ValueAddedCourseController.createValueAddedCourse);
router.get("/value-added-course", ValueAddedCourseController.getValueAddedCourse);
router.put("/value-added-course", ValueAddedCourseController.updateValueAddedCourse);
router.delete("/value-added-course", ValueAddedCourseController.deleteValueAddedCourse);

module.exports = router;
