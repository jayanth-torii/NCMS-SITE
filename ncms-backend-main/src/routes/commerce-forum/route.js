const express = require("express");
const router = express.Router();
const CommerceForumController = require("../../controllers/commerce-forum/controller");

// Standard CRUD for the CommerceForum page content (singleton)
router.post("/commerce-forum", CommerceForumController.createCommerceForum);
router.get("/commerce-forum", CommerceForumController.getCommerceForum);
router.put("/commerce-forum", CommerceForumController.updateCommerceForum);
router.delete("/commerce-forum", CommerceForumController.deleteCommerceForum);

module.exports = router;
