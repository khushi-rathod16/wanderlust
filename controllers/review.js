const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    const review = await Review.create({
      comment: req.body.review.comment,
      rating: req.body.review.rating,
      author: req.user._id
    });

    listing.reviews.push(review._id);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${req.params.id}`);
  };

  module.exports.destroyReview = async (req, res) => {

    const { id, reviewID } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewID }
    });

    await Review.findByIdAndDelete(reviewID);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  };