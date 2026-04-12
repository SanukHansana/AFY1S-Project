import { test, expect } from "@playwright/test";

const API_BASE =
  process.env.PLAYWRIGHT_API_BASE_URL || "http://localhost:5001/api";

const uniqueEmail = () =>
  `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@test.com`;

async function createUser(request, role = "client") {
  const email = uniqueEmail();
  const password = "TestPass123!";

  const res = await request.post(`${API_BASE}/users/register`, {
    data: {
      name: "Test Userasds",
      email,
      password,
      role,
    },
  });

  const body = await res.json();
  return { email, password, user: body.user };
}

async function loginUser(request, email, password) {
  const res = await request.post(`${API_BASE}/users/login`, {
    data: { email, password },
  });

  const body = await res.json();
  return body.token;
}

test.describe("User Management Integration Tests", () => {

  // =========================
  // REGISTER
  // =========================
  test("should register a new user", async ({ request }) => {
    const email = uniqueEmail();

    const res = await request.post(`${API_BASE}/users/register`, {
      data: {
        name: "Test Userdddd",
        email,
        password: "TestPass123!",
        role: "client",
      },
    });

    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body).toHaveProperty("token");
    expect(body.user.email).toBe(email);
  });

  // =========================
  // DUPLICATE REGISTER
  // =========================
  test("should not allow duplicate registration", async ({ request }) => {
    const email = uniqueEmail();

    await request.post(`${API_BASE}/users/register`, {
      data: {
        name: "Test User",
        email,
        password: "TestPass123!",
      },
    });

    const res = await request.post(`${API_BASE}/users/register`, {
      data: {
        name: "Test User",
        email,
        password: "TestPass123!",
      },
    });

    expect(res.status()).toBe(400);
  });

  // =========================
  // VALIDATION ERROR
  // =========================
  test("should fail with missing fields", async ({ request }) => {
    const res = await request.post(`${API_BASE}/users/register`, {
      data: {
        email: uniqueEmail(),
      },
    });

    expect(res.status()).toBe(400);
  });

  // =========================
  // LOGIN SUCCESS
  // =========================
  test("should login successfully", async ({ request }) => {
    const { email, password } = await createUser(request);

    const token = await loginUser(request, email, password);

    expect(token).toBeTruthy();
  });

  // =========================
  // WRONG PASSWORD
  // =========================
  test("should fail with wrong password", async ({ request }) => {
    const { email } = await createUser(request);

    const res = await request.post(`${API_BASE}/users/login`, {
      data: {
        email,
        password: "wrongpass",
      },
    });

    expect(res.status()).toBe(400);
  });

  // =========================
  // USER NOT FOUND
  // =========================
  test("should fail if user does not exist", async ({ request }) => {
    const res = await request.post(`${API_BASE}/users/login`, {
      data: {
        email: "nouser@test.com",
        password: "123456",
      },
    });

    expect(res.status()).toBe(400);
  });

  // =========================
  // GET ALL USERS
  // =========================
  test("should get all users (authorized)", async ({ request }) => {
    const { email, password } = await createUser(request, "admin");
    const token = await loginUser(request, email, password);

    const res = await request.get(`${API_BASE}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  // =========================
  // NO TOKEN
  // =========================
  test("should fail without token", async ({ request }) => {
    const res = await request.get(`${API_BASE}/users`);

    expect(res.status()).toBe(401);
  });

  // =========================
  // GET USER BY ID (SAFE VERSION)
  // =========================
  test("should get user by ID", async ({ request }) => {
    const { email, password } = await createUser(request, "admin");
    const token = await loginUser(request, email, password);

    const usersRes = await request.get(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await usersRes.json();
    const userId = users[0]._id;

    const res = await request.get(`${API_BASE}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
  });

  // =========================
  // UPDATE USER (AUTH ONLY)
  // =========================
  test("should update user", async ({ request }) => {
    const { email, password } = await createUser(request, "admin");
    const token = await loginUser(request, email, password);

    const usersRes = await request.get(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await usersRes.json();
    const userId = users[0]._id;

    const res = await request.put(`${API_BASE}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: "Updated User",
      },
    });

    expect(res.status()).toBe(200);
  });

  // =========================
  // DELETE USER
  // =========================
  test("should delete user", async ({ request }) => {
    const { email, password } = await createUser(request, "admin");
    const token = await loginUser(request, email, password);

    const usersRes = await request.get(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await usersRes.json();
    const userId = users[0]._id;

    const res = await request.delete(`${API_BASE}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(200);
  });
});