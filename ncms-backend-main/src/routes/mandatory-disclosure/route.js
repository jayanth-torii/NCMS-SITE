const express = require("express");
const router = express.Router();
const MandatoryDisclosureController = require("../../controllers/mandatory-disclosure/controller");

// Standard CRUD for the MandatoryDisclosure page content (singleton)
router.post("/mandatory-disclosure", MandatoryDisclosureController.createMandatoryDisclosure);
router.get("/mandatory-disclosure", MandatoryDisclosureController.getMandatoryDisclosure);
router.put("/mandatory-disclosure", MandatoryDisclosureController.updateMandatoryDisclosure);
router.delete("/mandatory-disclosure", MandatoryDisclosureController.deleteMandatoryDisclosure);

module.exports = router;
