const router = require("express").Router();
const { verifyToken }  = require("../middleware/authenticate");
const {
  createReview,
  getReviews,
  deleteReview,
} = require("../controller/reviewController");


router.post("/", verifyToken, createReview );
router.get("/:productId", getReviews )
router.delete("/:id", deleteReview)     // not done yet

module.exports = router;