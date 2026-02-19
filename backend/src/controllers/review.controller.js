import * as reviewService from "../services/review.service.js";

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

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

export const getReview = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: "Not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.params.id,
      req.body
    );
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
