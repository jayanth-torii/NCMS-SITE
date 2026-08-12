const express = require("express");
const router = express.Router();
const KalaChaitanyaController = require("../../controllers/kala-chaitanya/controller");

// Standard CRUD for the KalaChaitanya page content (singleton)
router.post("/kala-chaitanya", KalaChaitanyaController.createKalaChaitanya);
router.get("/kala-chaitanya", KalaChaitanyaController.getKalaChaitanya);
router.put("/kala-chaitanya", KalaChaitanyaController.updateKalaChaitanya);
router.delete("/kala-chaitanya", KalaChaitanyaController.deleteKalaChaitanya);

module.exports = router;
