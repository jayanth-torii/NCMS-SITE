const express = require("express");
const router = express.Router();
const AuditReportController = require("../../controllers/audit-report/controller");

// Standard CRUD for the AuditReport page content (singleton)
router.post("/audit-report", AuditReportController.createAuditReport);
router.get("/audit-report", AuditReportController.getAuditReport);
router.put("/audit-report", AuditReportController.updateAuditReport);
router.delete("/audit-report", AuditReportController.deleteAuditReport);

module.exports = router;
