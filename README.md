# Questions Backend API

This project provides a backend API for managing questions loaded from the Stack Overflow API. The API allows you to load, create, fetch, update, and delete questions while supporting filtering, sorting, and pagination.

---

## **Features**

- **POST /api/questions/load**: Load questions from the Stack Overflow API into your database.
- **GET /api/questions**: Fetch questions with filtering, sorting, and pagination.
- **POST /api/questions**: Create a new question.
- **GET /api/questions/:id**: Fetch a specific question by its ID.
- **PUT /api/questions/:id**: Update a question by its ID.
- **DELETE /api/questions/:id**: Delete a question by its ID.

---

## **Technologies Used**

- **Node.js**: Backend runtime.
- **PostgreSQL**: Database for storing questions.
- **Next.js**: Used for API routing.
- **Postman**: For API testing.
- **dotenv**: To manage environment variables.

---

## **Getting Started**

### **Prerequisites**

1. **Node.js**: [Install Node.js](https://nodejs.org/)
2. **PostgreSQL**: [Install PostgreSQL](https://www.postgresql.org/)
3. **Postman**: [Install Postman](https://www.postman.com/)

---

### **Setup Instructions**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/questions-backend.git
   cd questions-backend
   ```

## Install Dependencies

```bash
npm install
```

## Set Up Environment Variables

Create a `.env` file in the root directory with the following values:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
```

## Run Database Migrations

Ensure your database has a `questions` table with the following schema:

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    stack_id INT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT,
    is_answered BOOLEAN NOT NULL,
    tags TEXT[],
    score INT,
    answer_count INT,
    created_at TIMESTAMP
);
```

## Start the Server

```bash
npm run dev
```

## Test with Postman

Use the Postman collection provided or create your own requests to test the API.

---

## API Endpoints

### 1. POST `/api/questions/load`

**Description:** Load questions from Stack Overflow into the database.

**Response:**

- `201 Created`: Successfully loaded questions.
- `500 Internal Server Error`: An error occurred.

### 2. GET `/api/questions`

**Description:** Fetch all questions with optional filters, sorting, and pagination.

**Query Parameters:**

- `is_answered` (boolean): Filter by answered status.
- `tags` (comma-separated list): Filter by tags.
- `answers_count__gt` (int): Filter by answer count greater than a value.
- `answers_count__lt` (int): Filter by answer count less than a value.
- `sort` (string): Sort by `score` or `created_at`.
- `page` (int): Pagination (default is 1).

**Response:**

- `200 OK`: Returns a list of questions.

### 3. POST `/api/questions`

**Description:** Create a new question.

**Request Body:**

```json
{
  "stack_id": 123,
  "title": "Question title",
  "body": "Question body",
  "is_answered": false,
  "tags": ["tag1", "tag2"],
  "score": 0,
  "answer_count": 0,
  "created_at": "2025-01-07T10:00:00Z"
}
```

**Response:**

- `201 Created`: Returns the created question.

### 4. GET `/api/questions/:id`

**Description:** Fetch a specific question by its ID.

**Response:**

- `200 OK`: Returns the question details.
- `404 Not Found`: Question not found.

### 5. PUT `/api/questions/:id`

**Description:** Update a specific question by its ID.

**Request Body:**

```json
{
  "title": "Updated title for the question",
  "body": "Updated body for the question.",
  "is_answered": true,
  "tags": ["updated", "question"],
  "score": 10,
  "answer_count": 5,
  "created_at": "2025-01-07T10:00:00Z"
}
```

**Response:**

- `200 OK`: Returns the updated question.
- `404 Not Found`: Question not found.

### 6. DELETE `/api/questions/:id`

**Description:** Delete a specific question by its ID.

**Response:**

- `200 OK`: Successfully deleted.
- `404 Not Found`: Question not found.

---
