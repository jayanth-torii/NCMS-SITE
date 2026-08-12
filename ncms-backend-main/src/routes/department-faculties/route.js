const express = require("express");
const router = express.Router();
const DepartmentFacultiesController = require("../../controllers/department-faculties/controller");

// Standard CRUD for the DepartmentFaculties page content (singleton)
router.post("/department-faculties", DepartmentFacultiesController.createDepartmentFaculties);
router.get("/department-faculties", DepartmentFacultiesController.getDepartmentFaculties);
router.put("/department-faculties", DepartmentFacultiesController.updateDepartmentFaculties);
router.delete("/department-faculties", DepartmentFacultiesController.deleteDepartmentFaculties);

module.exports = router;
