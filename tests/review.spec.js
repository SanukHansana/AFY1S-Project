import { test, expect } from '@playwright/test';

test("reviews API returns review objects", async ({ request }) => {

  const response = await request.get("http://localhost:5001/api/reviews");

  expect(response.status()).toBe(200);

  const data = await response.json();

  expect(Array.isArray(data)).toBe(true);

  if (data.length > 0) {
    expect(data[0]).toHaveProperty("title");
    expect(data[0]).toHaveProperty("comment");
    expect(data[0]).toHaveProperty("rating");
  }

});