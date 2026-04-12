<div align="center">

# AFY1S Project

**A full-stack learning and freelancing platform built with React, Vite, Express, and MongoDB**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20Node-3c873a?style=for-the-badge)](./backend)
[![Database](https://img.shields.io/badge/Database-MongoDB-4ea94b?style=for-the-badge)](./backend)
[![Testing](https://img.shields.io/badge/Testing-Playwright%20%2B%20node%3Atest-7b61ff?style=for-the-badge)](./tests)

[Project Overview](#project-overview) | [Setup Instructions](#setup-instructions) | [API Endpoint Documentation](#api-endpoint-documentation) | [Testing](#testing) | [Deployment Report](#deployment-report)

**Live Frontend:** https://skill-connect-umber-mu.vercel.app/  
**Live Backend:** https://afy1s-project-production.up.railway.app

</div>

---

## Project Overview

AFY1S Project is designed as a combined **learning marketplace** and **freelancing platform**. It gives users one place to discover skills, enroll in courses, track learning progress, browse or publish jobs, apply for opportunities, manage reviews, and work with role-based dashboards.

The application combines multiple academic assignment features into one connected system:

| Module | What it does |
| --- | --- |
| User Management | Supports registration, login, current-user lookup, admin user management, and role-based access |
| Skills | Allows creating, viewing, updating, and deleting skill records |
| Courses | Supports course creation, listing, editing, and deletion |
| Enrollments | Lets authenticated users enroll in courses, update progress, complete courses, and view enrolled items |
| Jobs | Supports job posting, job browsing, editing, deleting, applying, and hiring workflows |
| Reviews | Supports public review listing and protected create, update, and delete actions |
| Currency Conversion | Supports converted job budgets through exchange-rate endpoints |

### Key Highlights

- Full-stack architecture with separate `frontend` and `backend` applications
- JWT-based authentication and role-based route protection
- Client, freelancer, and admin workflows
- API-based integration testing with Playwright
- Backend service-level unit testing with `node:test`
- Load/performance scenario configuration included in the repository

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, DaisyUI, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Testing | `node:test`, Playwright |
| Performance Testing | Load-test configuration with `multiload-test.yml` |

## Project Structure

```text
AFY1S-Project/
|-- backend/               # Express API and MongoDB logic
|-- frontend/              # React + Vite client application
|-- tests/                 # Playwright integration tests
|-- backend/unittests/     # Node unit tests
|-- multiload-test.yml     # Performance/load-test scenario
`-- playwright.config.ts   # Playwright configuration
```

## Setup Instructions

### Prerequisites

Before running the project, make sure these are installed on your machine:

- Node.js
- npm
- MongoDB connection string or MongoDB Atlas database

### 1. Clone the Repository

```bash
git clone https://github.com/SanukHansana/AFY1S-Project.git
cd AFY1S-Project
```

### 2. Install Dependencies

Install packages for the root, backend, and frontend:

```bash
npm install
cd backend
npm install
cd ..
cd frontend
npm install
cd ..
```

### 3. Create Environment Files

Create the following files:

- `backend/.env`
- `frontend/.env`

Use the exact variable structure below.

## Environment Variables

### Backend `.env`

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
SENDGRID_API_KEY=your_sendgrid_api_key
JWT_SECRET=your_jwt_secret
EMAIL_FROM=your_sender_email
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_MODEL=your_huggingface_model
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
EXCHANGE_RATE_CACHE_MINUTES=30
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5001
```

Important:

- `VITE_API_URL` should use the backend base URL only
- Do not add `/api` at the end of `VITE_API_URL`

### 4. Start the Backend

From the project root:

```bash
cd backend
npm run dev
```

Backend default URL:

```text
http://localhost:5001
```

### 5. Start the Frontend

Open another terminal from the project root:

```bash
cd frontend
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

### 6. Build for Production

Frontend build:

```bash
cd frontend
npm run build
```

Backend production start:

```bash
cd backend
npm start
```

## Default Accounts

These sample accounts are already included for easy testing.

### Admin Account

```text
Username: sanuk
Email: sanuk@gmail.com
Password: qwe123QWE!@#
```

### Client Account

```text
Username: nimal
Email: nimal@gmail.com
Password: qwe123QWE!@#
```

### Freelancer Account

```text
Username: ruwan
Email: ruwan@gmail.com
Password: qwe123QWE!@#
```

## Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/login` | User login |
| `/register` | User registration |
| `/skills` | Skills page |
| `/courses` | Course listing |
| `/courses/new` | Create course |
| `/my-courses` | Enrolled courses |
| `/jobs` | Browse jobs |
| `/jobs/create` | Create a job |
| `/jobs/:id` | View job details |
| `/jobs/:id/edit` | Edit a created job |
| `/my-jobs` | View posted jobs or applied jobs |
| `/reviews/dashboard` | Review dashboard |
| `/admin` | Admin dashboard |

## API Endpoint Documentation

Base Backend URL:

```text
http://localhost:5001
```

All endpoint paths below already include the `/api` prefix.

Correct format example:

```text
/api/skills/:id
```

### User Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/users/register` | Public | Register a new user |
| `POST` | `/api/users/login` | Public | Login and receive JWT |
| `GET` | `/api/users` | Admin | Get all users |
| `GET` | `/api/users/me` | Authenticated | Get the current logged-in user |
| `GET` | `/api/users/:id` | Authenticated | Get a user by ID |
| `PUT` | `/api/users/:id` | Current implementation uses validation but no route-level auth middleware | Update a user |
| `DELETE` | `/api/users/:id` | Admin | Delete a user |

### Job Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/jobs` | Public | Get jobs with filters, pagination, and optional currency conversion |
| `GET` | `/api/jobs/:id` | Public | Get a single job |
| `POST` | `/api/jobs` | Client/Admin | Create a job |
| `PUT` | `/api/jobs/:id` | Owner/Admin | Update a job |
| `DELETE` | `/api/jobs/:id` | Owner/Admin | Delete a job |
| `POST` | `/api/jobs/:id/apply` | Freelancer/Admin | Apply to a job |
| `POST` | `/api/jobs/:id/hire` | Client/Admin | Hire a freelancer for a job |

Common job query parameters:

- `search`
- `category`
- `skill`
- `location`
- `jobType`
- `status`
- `page`
- `limit`
- `currency`

### Course Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/courses` | Current implementation has validation but no route-level auth middleware | Create a course |
| `GET` | `/api/courses` | Public | Get all courses |
| `GET` | `/api/courses/:id` | Public | Get a course by ID |
| `PUT` | `/api/courses/:id` | Current implementation has validation but no route-level auth middleware | Update a course |
| `DELETE` | `/api/courses/:id` | Current implementation has validation but no route-level auth middleware | Delete a course |

### Enrollment Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/enrollments` | Authenticated | Enroll in a course |
| `GET` | `/api/enrollments/my-courses` | Authenticated | Get current user enrollments |
| `PUT` | `/api/enrollments/:enrollmentId/progress` | Authenticated | Update course progress |
| `PUT` | `/api/enrollments/:enrollmentId/complete` | Authenticated | Complete a course |
| `GET` | `/api/enrollments/:enrollmentId` | Authenticated | Get enrollment details |
| `DELETE` | `/api/enrollments/:enrollmentId` | Authenticated | Unenroll from a course |

### Review Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/reviews` | Public | Get all reviews |
| `GET` | `/api/reviews/:id` | Public | Get a review by ID |
| `POST` | `/api/reviews` | Authenticated | Create a review |
| `PUT` | `/api/reviews/:id` | Authenticated | Update a review |
| `DELETE` | `/api/reviews/:id` | Authenticated | Delete a review |

### Skill Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/skills` | Current implementation has validation but no route-level auth middleware | Create a skill |
| `GET` | `/api/skills` | Public | Get all skills |
| `GET` | `/api/skills/:id` | Public | Get a skill by ID |
| `PUT` | `/api/skills/:id` | Current implementation has validation but no route-level auth middleware | Update a skill |
| `DELETE` | `/api/skills/:id` | Current implementation has validation but no route-level auth middleware | Delete a skill |

### Exchange Rate Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/exchange/convert` | Public | Convert currency values |

## Testing

### Unit Testing

The project currently uses Node's built-in test runner for backend unit tests.

Run the job unit test from the project root:

```bash
node --test backend/unittests/jobservice.test.js
```

Run the review unit test from the project root:

```bash
node --test backend/unittests/reviewservice.test.js

Run enrollment testing from the project root:
```bash
node --test test-enrollment-summary.js

Run the
### Integration Testing

The project uses Playwright request-based API integration tests.

Run the job integration test:

```bash
npx playwright test job.spec.js
```

Run the review integration test:

```bash
npx playwright test review.spec.js
```

Run all Playwright tests:

```bash
npx playwright test
```

Notes:

- These integration tests currently target the backend API, not the frontend UI
- Playwright is configured to start or reuse the backend server automatically

Run course integration testing
node --test backend/test-wikipedia-integration.js

### Performance Testing

The repository includes a load/performance scenario file:

```text
multiload-test.yml
```

This scenario currently simulates traffic against:

- `/api/reviews`
- `/api/courses`
- `/api/jobs`

If Artillery is available in your environment, run:

```bash
npx artillery run multiload-test.yml
```

If Artillery is not installed, install it first and then use the same command.

## Deployment Report

This section can remain inside the README or be moved into a separate PDF for academic submission.

### What to Include

- Frontend hosting platform
- Backend hosting platform
- Database hosting platform
- Frontend live URL
- Backend live URL
- Build command used
- Start command used
- Environment variables configured
- Deployment issues faced
- How those issues were solved

### Current Deployment Summary

| Item | Details |
| --- | --- |
| Repository | `https://github.com/SanukHansana/AFY1S-Project` |
| Frontend Host | Vercel |
| Backend Host | Railway |
| Database Host | Add if needed |
| Frontend URL | `https://skill-connect-umber-mu.vercel.app/` |
| Backend URL | `https://afy1s-project-production.up.railway.app` |
| Deployment Status | Deployed |

## Testing Report

This section can remain inside the README or be moved into a separate PDF for academic submission.

### Testing Types Used

| Test Type | Tool | Scope |
| --- | --- | --- |
| Unit Testing | `node:test` | Backend service logic |
| Integration Testing | Playwright `request` API | Backend API workflow validation |
| Performance Testing | Load-test YAML configuration | API load behavior |

### Current Testing Summary

| Area | Test Type | File | Command |
| --- | --- | --- | --- |
| Jobs | Unit | `backend/unittests/jobservice.test.js` | `node --test backend/unittests/jobservice.test.js` |
| Jobs | Integration | `tests/job.spec.js` | `npx playwright test job.spec.js` |
| Reviews | Unit | `backend/unittests/reviewservice.test.js` | `node --test backend/unittests/reviewservice.test.js` |
| Reviews | Integration | `tests/review.spec.js` | `npx playwright test review.spec.js` |
| Mixed API Load | Performance | `multiload-test.yml` | `npx artillery run multiload-test.yml` |

### Suggested Submission Evidence

- Screenshot of successful unit test results
- Screenshot of successful Playwright integration test results
- Screenshot or output summary from the performance test
- Short explanation of tested modules and coverage
- Any known limitations, assumptions, or unfinished coverage areas
