const express = require("express");
const router = express.Router();
const DepartmentsPageController = require("../../controllers/departments-page/controller");

// Standard CRUD for the DepartmentsPage page content (singleton)
router.post("/departments-page", DepartmentsPageController.createDepartmentsPage);
router.get("/departments-page", DepartmentsPageController.getDepartmentsPage);
router.put("/departments-page", DepartmentsPageController.updateDepartmentsPage);
router.delete("/departments-page", DepartmentsPageController.deleteDepartmentsPage);

module.exports = router;
