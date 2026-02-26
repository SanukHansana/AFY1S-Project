# Wikipedia API Integration - Auto Description Generator

## 🎯 Feature Overview

The Skill Creation API now automatically fetches descriptions from Wikipedia when no description is provided by the user.

## 🔄 How It Works

### Request Flow:
1. User sends a POST request to `/api/skills` with or without a description
2. If description is empty/missing, the system automatically calls Wikipedia API
3. Wikipedia API returns a summary of the skill name
4. Description is saved to the database along with the skill

### Example Requests:

#### ✅ With Auto-Description (Wikipedia):
```bash
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "level": "Intermediate",
    "category": "Programming"
  }'
```

#### ✅ With Custom Description:
```bash
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "description": "A custom description provided by the user",
    "level": "Intermediate",
    "category": "Programming"
  }'
```

## 📡 Wikipedia API Details

### Endpoint Used:
```
https://en.wikipedia.org/api/rest_v1/page/summary/{skillName}
```

### Example:
```
https://en.wikipedia.org/api/rest_v1/page/summary/JavaScript
```

### Response Format:
```json
{
  "title": "JavaScript",
  "extract": "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web...",
  "description": "High-level programming language"
}
```

## 🛡️ Error Handling & Fallbacks

### 1. Wikipedia API Timeout
- **Timeout**: 5 seconds
- **Fallback**: Uses default description

### 2. Wikipedia Page Not Found
- **Fallback**: Uses default description

### 3. Network Errors
- **Fallback**: Uses default description

### 4. Default Description Format:
```
"{skillName} is a technical skill that can be learned and developed through practice and study."
```

## 📊 Response Format

### Successful Creation with Wikipedia Description:
```json
{
  "success": true,
  "message": "Skill created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "JavaScript",
    "description": "JavaScript, often abbreviated as JS, is a programming language...",
    "category": "Programming",
    "level": "Intermediate",
    "createdAt": "2024-02-26T18:00:00.000Z",
    "updatedAt": "2024-02-26T18:00:00.000Z",
    "__v": 0,
    "descriptionSource": "wikipedia"
  }
}
```

### Successful Creation with Custom Description:
```json
{
  "success": true,
  "message": "Skill created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Custom Skill",
    "description": "This is a custom description provided by user",
    "category": "Testing",
    "level": "Beginner",
    "createdAt": "2024-02-26T18:00:00.000Z",
    "updatedAt": "2024-02-26T18:00:00.000Z",
    "__v": 0,
    "descriptionSource": "user"
  }
}
```

## 🔧 Technical Implementation

### Key Features:
- **Axios HTTP Client**: For making API calls to Wikipedia
- **URL Encoding**: Properly formats skill names for Wikipedia URLs
- **Timeout Protection**: 5-second timeout prevents hanging requests
- **User-Agent**: Custom User-Agent header for API identification
- **Character Limit**: Descriptions limited to 500 characters for database storage
- **Error Logging**: Comprehensive logging for debugging

### Code Flow:
1. `createSkill()` function checks if description is provided
2. If missing, calls `fetchWikipediaDescription(skillName)`
3. Wikipedia API is called with proper error handling
4. Response is processed and limited to 500 characters
5. Fallback description is used if Wikipedia fails
6. Skill is saved with description and source tracking

## 🧪 Testing

### Run the Integration Test:
```bash
node test-wikipedia-integration.js
```

### Test Cases Covered:
1. ✅ Skill with Wikipedia auto-description
2. ✅ Skill with custom user description  
3. ✅ Skill not found on Wikipedia (fallback)

## 📝 Validation Rules

### Name Field:
- Required: Yes
- Length: 2-100 characters
- Characters: Letters, numbers, spaces, hyphens, underscores

### Description Field:
- Required: No (auto-fetched if missing)
- Length: Max 500 characters
- Source: User-provided or Wikipedia API

### Category Field:
- Required: No
- Length: 2-50 characters
- Characters: Letters, numbers, spaces, hyphens, underscores

### Level Field:
- Required: Yes
- Values: "Beginner", "Intermediate", "Advanced"

## 🚀 Benefits

1. **Better UX**: Users don't need to write descriptions
2. **Quality Content**: Wikipedia provides accurate, well-written descriptions
3. **Time Saving**: Faster skill creation process
4. **Consistency**: Standardized description format
5. **Fallback Protection**: Always works even if Wikipedia is down

## 🔍 Monitoring

### Console Logs:
```
Fetching Wikipedia description for: JavaScript
Successfully fetched description for JavaScript
```

### Error Logs:
```
Wikipedia API error for UnknownSkill: 404
Could not fetch Wikipedia description for "UnknownSkill", using default
```

## 🌐 API Rate Limits

- Wikipedia REST API has no official rate limits
- Best practice: Don't spam requests
- Current implementation uses 5-second timeout per request
- Suitable for moderate usage applications

## 🔄 Future Enhancements

1. **Multi-language Support**: Fetch descriptions in different languages
2. **Caching**: Cache Wikipedia responses to improve performance
3. **Alternative APIs**: Add other knowledge sources as fallbacks
4. **Manual Override**: Allow users to edit auto-fetched descriptions
5. **Batch Processing**: Fetch descriptions for multiple skills at once
