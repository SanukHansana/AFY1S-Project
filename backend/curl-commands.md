# API Testing with cURL Commands

## Setup
Make sure your server is running on `http://localhost:5001`

## Skills CRUD Testing

### Create Skill
```bash
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "description": "JavaScript programming language",
    "category": "Programming",
    "level": "Intermediate"
  }'
```

### Get All Skills
```bash
curl -X GET "http://localhost:5001/api/skills?page=1&limit=5"
```

### Get Skills by Level
```bash
curl -X GET "http://localhost:5001/api/skills?level=Intermediate"
```

### Search Skills
```bash
curl -X GET "http://localhost:5001/api/skills?search=javascript"
```

### Get Skill by ID
```bash
curl -X GET http://localhost:5001/api/skills/{SKILL_ID}
```

### Update Skill
```bash
curl -X PUT http://localhost:5001/api/skills/{SKILL_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript (Updated)",
    "description": "Updated JavaScript programming language",
    "category": "Programming",
    "level": "Advanced"
  }'
```

### Delete Skill
```bash
curl -X DELETE http://localhost:5001/api/skills/{SKILL_ID}
```

## Courses CRUD Testing

### Create Course
```bash
curl -X POST http://localhost:5001/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "skillId": "{SKILL_ID}",
    "duration": 40
  }'
```

### Get All Courses
```bash
curl -X GET "http://localhost:5001/api/courses?page=1&limit=5"
```

### Get Courses by Skill
```bash
curl -X GET "http://localhost:5001/api/courses?skillId={SKILL_ID}"
```

### Get Course by ID
```bash
curl -X GET http://localhost:5001/api/courses/{COURSE_ID}
```

### Update Course
```bash
curl -X PUT http://localhost:5001/api/courses/{COURSE_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Fundamentals (Updated)",
    "description": "Updated JavaScript course",
    "skillId": "{SKILL_ID}",
    "duration": 45
  }'
```

### Delete Course
```bash
curl -X DELETE http://localhost:5001/api/courses/{COURSE_ID}
```

## User Authentication Testing

### Register User
```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "client"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Enrollment Testing

### Enroll in Course
```bash
curl -X POST http://localhost:5001/api/enrollments/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -d '{
    "courseId": "{COURSE_ID}"
  }'
```

### Get My Courses
```bash
curl -X GET "http://localhost:5001/api/enrollments/my-courses?page=1&limit=5" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

### Update Progress
```bash
curl -X PUT http://localhost:5001/api/enrollments/{ENROLLMENT_ID}/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -d '{
    "progress": 75
  }'
```

### Complete Course
```bash
curl -X PUT http://localhost:5001/api/enrollments/{ENROLLMENT_ID}/complete \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

## Error Testing

### Test Invalid ID
```bash
curl -X GET http://localhost:5001/api/skills/invalid-id
```

### Test Missing Required Fields
```bash
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Missing name field"
  }'
```

### Test Unauthorized Access
```bash
curl -X GET http://localhost:5001/api/enrollments/my-courses
```

### Test Invalid Progress
```bash
curl -X PUT http://localhost:5001/api/enrollments/{ENROLLMENT_ID}/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -d '{
    "progress": 150
  }'
```

## Quick Test Sequence

1. **Start server**: `npm run dev`
2. **Create skill**: Use create skill command
3. **Create course**: Use create course command (with skill ID)
4. **Register/login**: Get JWT token
5. **Enroll in course**: Use enrollment command
6. **Test all CRUD operations**: Follow the sequence above

Replace `{SKILL_ID}`, `{COURSE_ID}`, `{ENROLLMENT_ID}`, and `{JWT_TOKEN}` with actual values from your test responses.
