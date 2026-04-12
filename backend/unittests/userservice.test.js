import test from "node:test";
import assert from "node:assert/strict";

// ======================================================
// 🔥 MOCK SETUP (MUST BE BEFORE SERVICE IMPORT)
// ======================================================

import User from "../src/models/UserModels.js";
import bcrypt from "bcryptjs";

// ---------- MOCK Mongoose Model Methods ----------

User.findOne = async (query) => {
  if (query.email === "john@test.com") {
    return {
      _id: "1",
      name: "John",
      email: "john@test.com",
      password: "hashed_123456",
      role: "user",
    };
  }
  return null;
};

User.create = async (data) => {
  return { _id: "1", ...data };
};

User.find = async () => {
  return [
    { _id: "1", name: "User1", email: "u1@test.com" },
    { _id: "2", name: "User2", email: "u2@test.com" },
  ];
};

User.findById = async (id) => {
  if (id === "1") {
    return { _id: "1", name: "User1", email: "u1@test.com" };
  }
  return null;
};

User.findByIdAndUpdate = async (id, data) => {
  if (id === "1") {
    return { _id: id, ...data };
  }
  return null;
};

User.findByIdAndDelete = async (id) => {
  if (id === "1") {
    return { _id: id };
  }
  return null;
};

// ---------- MOCK BCRYPT ----------
bcrypt.hash = async (pw) => "hashed_" + pw;
bcrypt.compare = async (pw, hashed) => pw === "123456";

// ======================================================
// 🔥 IMPORT SERVICE AFTER MOCKS
// ======================================================

import * as userService from "../src/services/user.service.js";

// ======================================================
// 🧪 TESTS
// ======================================================

// ---------------- CREATE USER ----------------
test("createUser should create a new user", async () => {
  const user = await userService.createUser({
    name: "New User",
    email: "new@test.com",
    password: "123456",
  });

  assert.equal(user.email, "new@test.com");
});

// ---------------- GET USERS ----------------
test("getUsers should return an array", async () => {
  const users = await userService.getUsers();
  assert.equal(Array.isArray(users), true);
  assert.equal(users.length, 2);
});

// ---------------- GET USER BY ID ----------------
test("getUserById should return a user", async () => {
  const user = await userService.getUserById("1");
  assert.equal(user._id, "1");
});

// ---------------- UPDATE USER ----------------
test("updateUser should update user data", async () => {
  const updated = await userService.updateUser("1", {
    name: "Updated Name",
  });

  assert.equal(updated.name, "Updated Name");
});

// ---------------- DELETE USER ----------------
test("deleteUser should remove user", async () => {
  const result = await userService.deleteUser("1");
  assert.equal(result.message, "User deleted successfully");
});

// ---------------- LOGIN USER ----------------
test("loginUser should return user data", async () => {
  const user = await userService.loginUser("john@test.com", "123456");

  assert.equal(user.email, "john@test.com");
});

// ---------------- LOGIN FAIL ----------------
test("loginUser should fail with wrong password", async () => {
  await assert.rejects(async () => {
    await userService.loginUser("john@test.com", "wrongpass");
  });
});