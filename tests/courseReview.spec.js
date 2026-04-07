// import { test, expect } from '@playwright/test';

// test("course reviews from API appear in UI", async ({ page, request }) => {

//   const courseId = "course1";

//   // get real data from backend
//   const apiResponse = await request.get(
//     `http://localhost:5001/api/reviews?course=${courseId}`
//   );

//   expect(apiResponse.status()).toBe(200);

//   const reviews = await apiResponse.json();

//   // open frontend page
//   await page.goto(`http://localhost:5173`);

//   // wait until the same API call happens in the browser
//   await page.waitForResponse(r =>
//     r.url().includes(`/api/reviews?course=${courseId}`)
//   );

//   // verify UI contains backend data
//   if (reviews.length > 0) {
//     await expect(page.getByText(reviews[0].title)).toBeVisible();
//     await expect(page.getByText(reviews[0].comment)).toBeVisible();
//   } else {
//     // if there are no reviews, verify the page still loads
//     await expect(page.getByText("Course Reviews")).toBeVisible();
//   }

// });