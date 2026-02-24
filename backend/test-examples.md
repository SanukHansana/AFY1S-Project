# Testing Your CRUD Functions - Complete Guide

## 1. Automated Test Script (Recommended)

### Run the Complete Test Suite
```bash
# Install axios if not already installed
npm install axios

# Run the test script
node test-api.js
```

This script will:
- ✅ Test all CRUD operations for Skills
- ✅ Test all CRUD operations for Courses  
- ✅ Test user authentication
- ✅ Test enrollment functionality
- ✅ Provide detailed success/failure feedback

## 2. Manual Testing with cURL

### Quick Test Sequence
```bash
# 1. Start your server
npm run dev

# 2. Test Skills CRUD
# Create skill
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Skill","category":"Programming","level":"Intermediate"}'

# Get all skills
curl -X GET http://localhost:5001/api/skills

# Get skill by ID (use ID from create response)
curl -X GET http://localhost:5001/api/skills/{SKILL_ID}

# Update skill
curl -X PUT http://localhost:5001/api/skills/{SKILL_ID} \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Skill","category":"Programming","level":"Advanced"}'

# Delete skill
curl -X DELETE http://localhost:5001/api/skills/{SKILL_ID}
```

## 3. Postman Testing

### Import Collection
1. Open Postman
2. Click "Import" → "Raw text"
3. Copy the JSON below and paste it

```json
{
  "info": {
    "name": "Learning Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Skills",
      "item": [
        {
          "name": "Create Skill",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"JavaScript\",\n  \"description\": \"JavaScript programming\",\n  \"category\": \"Programming\",\n  \"level\": \"Intermediate\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/skills",
              "host": ["{{baseUrl}}"],
              "path": ["api", "skills"]
            }
          }
        },
        {
          "name": "Get All Skills",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/skills?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["api", "skills"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Get Skill by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/skills/{{skillId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "skills", "{{skillId}}"]
            }
          }
        },
        {
          "name": "Update Skill",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"JavaScript (Updated)\",\n  \"description\": \"Updated description\",\n  \"category\": \"Programming\",\n  \"level\": \"Advanced\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/skills/{{skillId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "skills", "{{skillId}}"]
            }
          }
        },
        {
          "name": "Delete Skill",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/api/skills/{{skillId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "skills", "{{skillId}}"]
            }
          }
        }
      ]
    },
    {
      "name": "Courses",
      "item": [
        {
          "name": "Create Course",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"JavaScript Course\",\n  \"description\": \"Learn JavaScript\",\n  \"skillId\": \"{{skillId}}\",\n  \"duration\": 40\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/courses",
              "host": ["{{baseUrl}}"],
              "path": ["api", "courses"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5001"
    },
    {
      "key": "skillId",
      "value": ""
    }
  ]
}
```

## 4. Unit Testing Examples

### Basic Controller Test Structure
```javascript
// test/skillController.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSkill, getSkillById } from '../src/controllers/skillController.js';
import Skill from '../src/models/Skill.js';

describe('Skill Controller', () => {
  beforeEach(async () => {
    await Skill.deleteMany({});
  });

  it('should create a skill successfully', async () => {
    const req = {
      body: {
        name: 'Test Skill',
        category: 'Programming',
        level: 'Intermediate'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createSkill(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Skill created successfully",
      data: expect.any(Object)
    });
  });

  it('should return 400 for duplicate skill name', async () => {
    // Create skill first
    await Skill.create({
      name: 'Test Skill',
      category: 'Programming',
      level: 'Intermediate'
    });

    const req = {
      body: {
        name: 'Test Skill', // Same name
        category: 'Programming',
        level: 'Intermediate'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createSkill(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Skill with this name already exists"
    });
  });
});
```

## 5. Validation Checklist

### Skills CRUD Validation
- [ ] Create skill with valid data → 201
- [ ] Create skill with missing required fields → 400
- [ ] Create skill with invalid level → 400
- [ ] Create duplicate skill name → 400
- [ ] Get skill with valid ID → 200
- [ ] Get skill with invalid ID → 404
- [ ] Update skill with valid data → 200
- [ ] Update skill with duplicate name → 400
- [ ] Delete skill with valid ID → 200
- [ ] Delete skill with invalid ID → 404

### Courses CRUD Validation
- [ ] Create course with valid skillId → 201
- [ ] Create course with invalid skillId → 404
- [ ] Get course with populated skill details → 200
- [ ] Update course with valid skillId → 200
- [ ] Delete course → 200

### Enrollment Validation
- [ ] Enroll in course without auth → 401
- [ ] Enroll in valid course → 201
- [ ] Enroll twice in same course → 400
- [ ] Update progress without auth → 401
- [ ] Update progress with invalid value → 400
- [ ] Update other user's progress → 403
- [ ] Complete course → 200

## 6. Common Issues & Solutions

### Server Not Starting
```bash
# Check if port is in use
netstat -ano | findstr :5001

# Kill process if needed
taskkill /PID <PID> /F
```

### Database Connection Issues
```bash
# Check MongoDB connection string in .env
cat .env

# Verify MongoDB is running
# For local MongoDB: mongod
# For Atlas: Check network access
```

### JWT Token Issues
```bash
# Check JWT_SECRET in .env
echo $JWT_SECRET

# Verify token format (should be Bearer <token>)
```

## 7. Performance Testing

### Load Testing with Apache Bench
```bash
# Test skills endpoint
ab -n 1000 -c 10 http://localhost:5001/api/skills

# Test courses endpoint
ab -n 1000 -c 10 http://localhost:5001/api/courses
```

## 8. Monitoring & Logging

### Add Request Logging
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
```

### Check Server Logs
```bash
# View real-time logs
npm run dev

# Check for errors in console output
# Look for MongoDB connection errors
# Look for validation errors
```

## Quick Start Testing

1. **Start server**: `npm run dev`
2. **Run automated test**: `node test-api.js`
3. **Check results**: Look for ✅ success indicators
4. **Manual testing**: Use curl commands from curl-commands.md
5. **Postman**: Import the collection for GUI testing

This comprehensive testing approach ensures your CRUD functions work correctly in all scenarios!
