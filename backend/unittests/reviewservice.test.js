import test from "node:test";
import assert from "node:assert";

import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} from "../src/services/review.service.js";

test("createReview should be a function", () => {
  assert.strictEqual(typeof createReview, "function");
});

test("getAllReviews should be a function", () => {
  assert.strictEqual(typeof getAllReviews, "function");
});

test("getReviewById should be a function", () => {
  assert.strictEqual(typeof getReviewById, "function");
});

test("updateReview should be a function", () => {
  assert.strictEqual(typeof updateReview, "function");
});

test("deleteReview should be a function", () => {
  assert.strictEqual(typeof deleteReview, "function");
});