const express = require("express");
const router = express.Router();
const PragyanScienceForumController = require("../../controllers/pragyan-science-forum/controller");

// Standard CRUD for the PragyanScienceForum page content (singleton)
router.post("/pragyan-science-forum", PragyanScienceForumController.createPragyanScienceForum);
router.get("/pragyan-science-forum", PragyanScienceForumController.getPragyanScienceForum);
router.put("/pragyan-science-forum", PragyanScienceForumController.updatePragyanScienceForum);
router.delete("/pragyan-science-forum", PragyanScienceForumController.deletePragyanScienceForum);

module.exports = router;
