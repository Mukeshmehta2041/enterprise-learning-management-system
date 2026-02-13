# Assignment Service API Spec

**Base URL:** `/api/v1/assignments`

## Endpoints

### 1. Create Assignment
`POST /`
- **Roles:** ADMIN, INSTRUCTOR
- **Request Body:**
```json
{
  "courseId": "uuid",
  "moduleId": "uuid (optional)",
  "lessonId": "uuid (optional)",
  "title": "Assignment Title",
  "description": "Details about the assignment",
  "dueDate": "ISO8601 string",
  "maxScore": 100
}
```

### 2. List Assignments for Course
`GET /course/{courseId}`
- **Roles:** ANY (Student only see published, Instructor/Admin see all)

### 3. Get Assignment Details
`GET /{id}`
- **Roles:** ANY

### 4. Submit Assignment
`POST /{assignmentId}/submit`
- **Roles:** STUDENT
- **Request Body:**
```json
{
  "content": "Text or URL to submission"
}
```

### 5. List Submissions
`GET /{assignmentId}/submissions`
- **Roles:** INSTRUCTOR, ADMIN
- **Description:** Returns all submissions for a given assignment for grading.

### 6. Grade Submission
`POST /submissions/{submissionId}/grade`
- **Roles:** INSTRUCTOR, ADMIN
- **Request Body:**
```json
{
  "score": 95,
  "feedback": "Great job on the implementation!"
}
```

## Events

### AssignmentCreated
- **Topic:** `assignment.events`
- **Fields:** `id`, `courseId`, `moduleId`, `lessonId`, `title`

### AssignmentSubmitted
- **Topic:** `assignment.events`
- **Fields:** `id`, `assignmentId`, `studentId`, `submittedAt`

### AssignmentGraded
- **Topic:** `assignment.events`
- **Fields:** `id`, `submissionId`, `score`, `studentId`
