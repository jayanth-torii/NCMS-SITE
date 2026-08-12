const express = require("express");
const router = express.Router();
const DepartmentBannersController = require("../../controllers/department-banners/controller");

// Standard CRUD for the DepartmentBanners page content (singleton)
router.post("/department-banners", DepartmentBannersController.createDepartmentBanners);
router.get("/department-banners", DepartmentBannersController.getDepartmentBanners);
router.put("/department-banners", DepartmentBannersController.updateDepartmentBanners);
router.delete("/department-banners", DepartmentBannersController.deleteDepartmentBanners);

module.exports = router;
