import Review from "../models/review.model.js";

export const createReview = async (data) => {
  return await Review.create(data);
};

export const getAllReviews = async (filter, options) => {
  const { page = 1, limit = 10 } = options;

  return await Review.find(filter)
    .populate("user", "name email")
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getReviewById = async (id) => {
  return await Review.findById(id).populate("user");
};

export const updateReview = async (id, data) => {
  return await Review.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};
