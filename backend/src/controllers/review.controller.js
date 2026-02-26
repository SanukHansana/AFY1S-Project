
import * as reviewService from "../services/review.service.js";
import { checkModeration } from "../utils/moderation.js";

// Create Review
export const createReview = async (req, res, next) => {
  try {
    const textToCheck = `${req.body.title} ${req.body.comment}`;

    const moderation = await checkModeration(textToCheck);

    if (moderation.flagged) {
      return res.status(400).json({
        message: "Review contains toxic or harmful content.",
        details: moderation.scores,
      });
    }

    const review = await reviewService.createReview({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// Get All Reviews
export const getReviews = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.course) filter.course = req.query.course;
    if (req.query.job) filter.job = req.query.job;

    const reviews = await reviewService.getAllReviews(
      filter,
      req.query
    );

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

// Get Single Review
export const getReview = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    res.json(review);
  } catch (err) {
    next(err);
  }
};

// Update Review (Owner Only)
export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // Owner check
    if (review.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await reviewService.updateReview(
      req.params.id,
      req.body
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete Review (Owner or Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // Owner or admin
    if (
      review.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await reviewService.deleteReview(req.params.id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};