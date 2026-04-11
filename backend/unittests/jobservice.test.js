import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import Job from "../src/models/Job.js";
import * as jobService from "../src/services/job.service.js";

const originalMethods = {
  find: Job.find,
  countDocuments: Job.countDocuments,
  findById: Job.findById,
  findByIdAndUpdate: Job.findByIdAndUpdate,
  findByIdAndDelete: Job.findByIdAndDelete,
};

const attachPopulateChain = (result) => {
  result.populate = function populate() {
    return this;
  };

  return result;
};

afterEach(() => {
  Job.find = originalMethods.find;
  Job.countDocuments = originalMethods.countDocuments;
  Job.findById = originalMethods.findById;
  Job.findByIdAndUpdate = originalMethods.findByIdAndUpdate;
  Job.findByIdAndDelete = originalMethods.findByIdAndDelete;
});

test("getJobs returns paginated results using the provided filter and sort", async () => {
  const captured = {};
  const mockJobs = [
    { _id: "507f1f77bcf86cd799439011", title: "Build dashboard" },
  ];

  Job.find = (filter) => {
    captured.filter = filter;

    return {
      populate(path, fields) {
        captured.populates = captured.populates || [];
        captured.populates.push([path, fields]);
        return this;
      },
      skip(value) {
        captured.skip = value;
        return this;
      },
      limit(value) {
        captured.limit = value;
        return this;
      },
      sort(value) {
        captured.sort = value;
        return Promise.resolve(mockJobs);
      },
    };
  };

  Job.countDocuments = async (filter) => {
    captured.countFilter = filter;
    return 11;
  };

  const result = await jobService.getJobs(
    { status: "open" },
    { page: 2, limit: 5, sortBy: "budget", sortOrder: "asc" }
  );

  assert.deepEqual(captured.filter, { status: "open" });
  assert.deepEqual(captured.countFilter, { status: "open" });
  assert.equal(captured.skip, 5);
  assert.equal(captured.limit, 5);
  assert.deepEqual(captured.sort, { budget: 1 });
  assert.deepEqual(result.jobs, mockJobs);
  assert.deepEqual(result.pagination, {
    currentPage: 2,
    totalPages: 3,
    totalJobs: 11,
    hasNext: true,
    hasPrev: true,
  });
});

test("applyToJob adds a new applicant, changes open jobs to applied, and returns the populated job", async () => {
  const jobId = "507f1f77bcf86cd799439011";
  const freelancerId = "507f1f77bcf86cd799439012";
  const employerId = "507f1f77bcf86cd799439013";

  let saveCalled = false;
  let findByIdCalls = 0;

  const storedJob = {
    _id: jobId,
    employerId,
    freelancerId: null,
    applicants: [],
    status: "open",
    async save() {
      saveCalled = true;
    },
  };

  const populatedJob = attachPopulateChain({
    _id: jobId,
    status: "applied",
    applicants: [{ _id: freelancerId }],
  });

  Job.findById = () => {
    findByIdCalls += 1;
    return findByIdCalls === 1 ? storedJob : populatedJob;
  };

  const result = await jobService.applyToJob(jobId, freelancerId);

  assert.equal(saveCalled, true);
  assert.deepEqual(storedJob.applicants, [freelancerId]);
  assert.equal(storedJob.status, "applied");
  assert.equal(result, populatedJob);
});

test("applyToJob rejects employers applying to their own jobs", async () => {
  const jobId = "507f1f77bcf86cd799439011";
  const employerId = "507f1f77bcf86cd799439013";

  Job.findById = () => ({
    _id: jobId,
    employerId,
    freelancerId: null,
    applicants: [],
    status: "open",
  });

  await assert.rejects(
    () => jobService.applyToJob(jobId, employerId),
    (error) => {
      assert.equal(error.message, "Employer cannot apply to their own job");
      assert.equal(error.statusCode, 400);
      return true;
    }
  );
});

test("hireFreelancer assigns the applicant and moves the job to in-progress", async () => {
  const jobId = "507f1f77bcf86cd799439011";
  const freelancerId = "507f1f77bcf86cd799439012";

  let saveCalled = false;
  let findByIdCalls = 0;

  const storedJob = {
    _id: jobId,
    freelancerId: null,
    applicants: [freelancerId],
    status: "applied",
    async save() {
      saveCalled = true;
    },
  };

  const populatedJob = attachPopulateChain({
    _id: jobId,
    status: "in-progress",
    freelancerId: { _id: freelancerId },
  });

  Job.findById = () => {
    findByIdCalls += 1;
    return findByIdCalls === 1 ? storedJob : populatedJob;
  };

  const result = await jobService.hireFreelancer(jobId, freelancerId);

  assert.equal(saveCalled, true);
  assert.equal(storedJob.freelancerId, freelancerId);
  assert.equal(storedJob.status, "in-progress");
  assert.equal(result, populatedJob);
});

test("hireFreelancer rejects users who never applied to the job", async () => {
  const jobId = "507f1f77bcf86cd799439011";
  const freelancerId = "507f1f77bcf86cd799439012";

  Job.findById = () => ({
    _id: jobId,
    freelancerId: null,
    applicants: [],
    status: "applied",
  });

  await assert.rejects(
    () => jobService.hireFreelancer(jobId, freelancerId),
    (error) => {
      assert.equal(
        error.message,
        "This freelancer has not applied to the job"
      );
      assert.equal(error.statusCode, 400);
      return true;
    }
  );
});
