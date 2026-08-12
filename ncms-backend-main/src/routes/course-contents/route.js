const express = require("express");
const router = express.Router();
const CourseContentsController = require("../../controllers/course-contents/controller");

// Standard CRUD for the CourseContents page content (singleton)
router.post("/course-contents", CourseContentsController.createCourseContents);
router.get("/course-contents", CourseContentsController.getCourseContents);
router.put("/course-contents", CourseContentsController.updateCourseContents);
router.delete("/course-contents", CourseContentsController.deleteCourseContents);

module.exports = router;
