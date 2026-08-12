const express = require("express");
const router = express.Router();
const StudentCenterController = require("../../controllers/student-center/controller");

// Standard CRUD for the StudentCenter page content (singleton)
router.post("/student-center", StudentCenterController.createStudentCenter);
router.get("/student-center", StudentCenterController.getStudentCenter);
router.put("/student-center", StudentCenterController.updateStudentCenter);
router.delete("/student-center", StudentCenterController.deleteStudentCenter);

module.exports = router;
