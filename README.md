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

# Project Overview

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

---

# Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, DaisyUI, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Testing | `node:test`, Playwright |
| Performance Testing | Load-test configuration with `multiload-test.yml` |

---

# Project Structure

```text
AFY1S-Project/
|-- backend/               # Express API and MongoDB logic
|-- frontend/              # React + Vite client application
|-- tests/                 # Playwright integration tests
|-- backend/unittests/     # Node unit tests
|-- multiload-test.yml     # Performance/load-test scenario
`-- playwright.config.ts   # Playwright configuration