// backend/src/services/review.service.js

import Review from "../models/review.model.js";

// Create Review
export const createReview = async (data) => {
  const review = await Review.create(data);

  return await review.populate([
    { path: "user", select: "name email" },
    { path: "course", select: "title duration" },
    { path: "job", select: "title budget status" },
  ]);
};

// Get All Reviews
export const getAllReviews = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10 } = options;

  return await Review.find(filter)
    .populate("user", "name email")
    .populate("course", "title duration")
    .populate("job", "title budget status")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Get Review by ID
export const getReviewById = async (id) => {
  return await Review.findById(id)
    .populate("user", "name email")
    .populate("course")
    .populate("job");
};

// Update Review
export const updateReview = async (id, data) => {
  return await Review.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("user", "name email")
    .populate("course", "title duration")
    .populate("job", "title budget status");
};

// Delete Review
export const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};