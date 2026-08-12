const express = require("express");
const router = express.Router();
const GrievanceRedressalController = require("../../controllers/grievance-redressal/controller");

// Standard CRUD for the GrievanceRedressal page content (singleton)
router.post("/grievance-redressal", GrievanceRedressalController.createGrievanceRedressal);
router.get("/grievance-redressal", GrievanceRedressalController.getGrievanceRedressal);
router.put("/grievance-redressal", GrievanceRedressalController.updateGrievanceRedressal);
router.delete("/grievance-redressal", GrievanceRedressalController.deleteGrievanceRedressal);

module.exports = router;
