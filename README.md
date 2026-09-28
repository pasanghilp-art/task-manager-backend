# Task Manager — Backend

REST API for the [task-manager-react](https://github.com/pasanghilp-art/task-manager-react) app — handles storing, updating, and deleting tasks in MongoDB.

## Features
- Full CRUD for tasks (create, read, update, delete)
- Each task has a name, priority, and completion status
- MongoDB persistence via Mongoose

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- dotenv
- cors

## Task Schema
| Field | Type | Default |
|-------|------|---------|
| name | String | — |
| priority | String | — |
| done | Boolean | false |

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /tasks | Get all tasks |
| POST | /tasks | Create a task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

## Running Locally
git clone https://github.com/pasanghilp-art/task-manager-backend.git
cd task-manager-backend
npm install

Create a `.env` file in the root:
MONGO_URI=your_mongodb_connection_string
PORT=3000

Then start the server:
npm start
