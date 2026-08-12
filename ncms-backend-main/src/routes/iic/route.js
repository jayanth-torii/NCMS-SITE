const express = require("express");
const router = express.Router();
const IicController = require("../../controllers/iic/controller");

// Standard CRUD for the Iic page content (singleton)
router.post("/iic", IicController.createIic);
router.get("/iic", IicController.getIic);
router.put("/iic", IicController.updateIic);
router.delete("/iic", IicController.deleteIic);

module.exports = router;
