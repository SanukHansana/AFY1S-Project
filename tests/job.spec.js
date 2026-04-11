import { test, expect } from "@playwright/test";

const API_BASE =
  process.env.PLAYWRIGHT_API_BASE_URL || "http://localhost:5001/api";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const getEntityId = (entity) => entity?._id || entity?.id || entity;

const uniqueTag = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

async function registerUser(request, role, tag) {
  const response = await request.post(`${API_BASE}/users/register`, {
    data: {
      name: role === "client" ? "Job Client Tester" : "Job Freelancer Tester",
      email: `jobs-${role}-${tag}@example.com`,
      password: "JobPass!123",
      role,
    },
  });

  expect(response.status()).toBe(201);
  return response.json();
}

test("jobs API returns paginated job data", async ({ request }) => {
  const response = await request.get(`${API_BASE}/jobs`);

  expect(response.status()).toBe(200);

  const data = await response.json();

  expect(Array.isArray(data.jobs)).toBe(true);
  expect(data.pagination).toBeTruthy();
  expect(data.pagination).toHaveProperty("currentPage");
  expect(data.pagination).toHaveProperty("totalPages");

  if (data.jobs.length > 0) {
    expect(data.jobs[0]).toHaveProperty("_id");
    expect(data.jobs[0]).toHaveProperty("title");
    expect(data.jobs[0]).toHaveProperty("status");
  }
});

test("job API supports client management and freelancer application flow", async ({
  request,
}) => {
  const tag = uniqueTag();

  const client = await registerUser(request, "client", `${tag}-client`);
  const freelancer = await registerUser(
    request,
    "freelancer",
    `${tag}-freelancer`
  );

  const createResponse = await request.post(`${API_BASE}/jobs`, {
    headers: authHeaders(client.token),
    data: {
      title: `Integration Job ${tag}`,
      description: "Integration test job created through the jobs API flow.",
      category: "Testing",
      budget: 1250,
      skillsRequired: ["Playwright", "Node.js"],
      deadline: "2030-12-31",
      jobType: "Remote",
      location: "Colombo",
    },
  });

  expect(createResponse.status()).toBe(201);
  const createdJob = await createResponse.json();
  const jobId = createdJob._id;

  expect(createdJob.title).toBe(`Integration Job ${tag}`);

  const forbiddenUpdate = await request.put(`${API_BASE}/jobs/${jobId}`, {
    headers: authHeaders(freelancer.token),
    data: {
      title: "Freelancer should not update this job",
    },
  });

  expect(forbiddenUpdate.status()).toBe(403);

  const updateResponse = await request.put(`${API_BASE}/jobs/${jobId}`, {
    headers: authHeaders(client.token),
    data: {
      title: `Updated Integration Job ${tag}`,
      description: "Updated integration test job description.",
      category: "QA",
      budget: 1500,
      skillsRequired: ["Playwright", "API Testing"],
      deadline: "2031-01-15",
      jobType: "Hybrid",
      location: "Kandy",
      employerId: getEntityId(freelancer.user),
    },
  });

  expect(updateResponse.status()).toBe(200);
  const updatedJob = await updateResponse.json();

  expect(updatedJob.title).toBe(`Updated Integration Job ${tag}`);
  expect(updatedJob.budget).toBe(1500);
  expect(updatedJob.location).toBe("Kandy");
  expect(getEntityId(updatedJob.employerId)).toBe(getEntityId(client.user));

  const getSingleResponse = await request.get(`${API_BASE}/jobs/${jobId}`);
  expect(getSingleResponse.status()).toBe(200);

  const singleJob = await getSingleResponse.json();
  expect(singleJob.title).toBe(`Updated Integration Job ${tag}`);

  const listResponse = await request.get(
    `${API_BASE}/jobs?search=${encodeURIComponent(`Updated Integration Job ${tag}`)}`
  );
  expect(listResponse.status()).toBe(200);

  const listData = await listResponse.json();
  expect(
    listData.jobs.some((job) => job._id === jobId || job.title === `Updated Integration Job ${tag}`)
  ).toBe(true);

  const applyResponse = await request.post(`${API_BASE}/jobs/${jobId}/apply`, {
    headers: authHeaders(freelancer.token),
  });

  expect(applyResponse.status()).toBe(200);
  const appliedJob = await applyResponse.json();

  expect(appliedJob.status).toBe("applied");
  expect(
    appliedJob.applicants.some(
      (applicant) => getEntityId(applicant) === getEntityId(freelancer.user)
    )
  ).toBe(true);

  const hireResponse = await request.post(`${API_BASE}/jobs/${jobId}/hire`, {
    headers: authHeaders(client.token),
    data: {
      freelancerId: getEntityId(freelancer.user),
    },
  });

  expect(hireResponse.status()).toBe(200);
  const hiredJob = await hireResponse.json();

  expect(hiredJob.status).toBe("in-progress");
  expect(getEntityId(hiredJob.freelancerId)).toBe(getEntityId(freelancer.user));

  const deleteResponse = await request.delete(`${API_BASE}/jobs/${jobId}`, {
    headers: authHeaders(client.token),
  });

  expect(deleteResponse.status()).toBe(204);

  const deletedJobResponse = await request.get(`${API_BASE}/jobs/${jobId}`);
  expect(deletedJobResponse.status()).toBe(404);
});
