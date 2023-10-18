const createError  = require("../utils/error");
const Review = require("../models/Review");
const Product = require("../models/Product");

// create new review
const createReview = async (req, res, next) => {
    const {
        productId, star
    } = req.body;

    if (!productId || !star) {
        return next(createError(422, "Fill all the details" ));
    }

    if (req.user?.isAdmin) {
        return next(createError(404, "Admin can't create a review!"));
    }
    
    try {
        const review = await Review.findOne({
            productId,
            userId: req.user?.id,
        });

        if (review) {
            return next(
                createError(404, "You have already created a review for this product!")
            );
        }

        const newReview = new Review({
            userId: req.user?.id,
            ...req.body
        });
        const savedReview = await newReview.save();

        await Product.findByIdAndUpdate(productId, {
            $inc: { totalStars: star, starNumber: 1 },
        });
        res.status(201).json({
            status: 201,
            message: "Review created successflly",
            review: savedReview
        });
    } catch (err) {
        next(err);
    }
};

// get reviews
const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.status(200).send(reviews);
    } catch (err) {
        next(err);
    }
};

// delete review (not done yet)
const deleteReview = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createReview,
    getReviews,
    deleteReview
}