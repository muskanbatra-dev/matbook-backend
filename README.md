# MatBook Dynamic Form

A full-stack dynamic form builder application that generates forms from JSON schema, validates submissions, and stores them in a PostgreSQL database.

## Milestone Completion Status

### ✅ Completed Features

- **Dynamic Form Generation**: Form fields are dynamically generated from a JSON schema file
- **Multiple Field Types**: Support for text, number, select, multi-select, date, textarea, and switch fields
- **Client-Side Validation**: Real-time validation using TanStack React Form
- **Server-Side Validation**: Zod-based validation middleware for all form submissions
- **Form Submissions API**: RESTful API endpoints for creating and retrieving form submissions
- **Submissions View**: Table view of all submissions with pagination and sorting
- **Database Integration**: PostgreSQL database with Prisma ORM
- **Responsive UI**: Modern, responsive interface built with Tailwind CSS

### 🔄 In Progress / Future Enhancements

- Enhanced submissions view with detailed submission data display
- Form schema editor/management interface
- User authentication and authorization
- Export submissions functionality
- Advanced filtering and search capabilities

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL
- **ORM**: Prisma 7.0.1
- **Validation**: Zod 4.1.13
- **Additional**: 
  - CORS for cross-origin requests
  - dotenv for environment variables
  - @prisma/adapter-pg for PostgreSQL adapter

### Frontend
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Form Management**: TanStack React Form 1.0.0
- **Data Fetching**: TanStack React Query 5.90.11
- **Table Component**: TanStack React Table 8.21.3
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS 4.1.17
- **HTTP Client**: Axios 1.13.2

## Setup and Run Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database (local or remote)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the project root directory**:
   ```bash
   cd /Users/muskanbatra/matbook-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/matbook_db?schema=public"
   PORT=3000
   ```
   Replace `username`, `password`, `localhost`, `5432`, and `matbook_db` with your PostgreSQL credentials.

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npx prisma generate --schema=backend/prisma/schema.prisma
   
   # Run database migrations
   npx prisma migrate dev --schema=backend/prisma/schema.prisma
   ```

5. **Start the backend server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend API will be running on `http://localhost:3000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   - For local development, the frontend uses a Vite proxy configured in `vite.config.ts` to forward `/api` requests to `http://localhost:3000`
   - For production, update the API URLs in:
     - `frontend/src/Pages/DynamicFormPage.tsx` (line 19, 40)
     - `frontend/src/Pages/SubmissionsPage.tsx` (line 38)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173` (or another port if 5173 is occupied)

5. **Build for production**:
   ```bash
   npm run build
   ```

### Running the Full Application

1. Start the PostgreSQL database
2. Start the backend server (from root directory): `npm run dev`
3. Start the frontend server (from frontend directory): `npm run dev`
4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### `GET /api/form-schema`
Returns the form schema JSON that defines the form structure.

**Response**:
```json
{
  "title": "Employee Onboarding Form",
  "description": "...",
  "fields": [...]
}
```

### `POST /api/submissions`
Creates a new form submission.

**Request Body**: Form data matching the schema
**Response**:
```json
{
  "success": true,
  "id": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### `GET /api/submissions`
Retrieves paginated form submissions.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Field to sort by (default: "createdAt")
- `sortOrder` (optional): "asc" or "desc" (default: "desc")

**Response**:
```json
{
  "success": true,
  "submissions": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "sortBy": "createdAt",
  "sortOrder": "desc",
  "totalPages": 10
}
```

## Known Issues

1. **Hardcoded Production URLs**: The frontend currently uses hardcoded production API URLs (`https://matbook-backend-1.onrender.com`) instead of environment variables. This should be configured via environment variables for better flexibility between development and production environments.

2. **Submissions View**: The "View" button in the submissions table is currently non-functional. It needs implementation to display detailed submission data.

3. **Form Schema Location**: The form schema is read from a static JSON file (`backend/formSchema.json`). Consider implementing a database-backed schema management system for dynamic schema updates.

4. **Error Handling**: Some error messages could be more user-friendly and provide better guidance to users.

5. **Validation Coverage**: Not all validation rules from the schema (e.g., `minDate`, `minSelected`, `maxSelected`) are fully implemented in the client-side validation.

## Assumptions

1. **Database**: Assumes PostgreSQL is already set up and accessible. The connection string format follows Prisma's standard PostgreSQL connection string format.

2. **Form Schema**: The form schema JSON file (`backend/formSchema.json`) is assumed to be valid and properly formatted. The application does not validate the schema structure itself.

3. **Field Types**: The application assumes the following field types are supported:
   - `text`: Single-line text input
   - `number`: Numeric input
   - `select`: Single-select dropdown
   - `multi-select`: Multi-select dropdown
   - `date`: Date picker
   - `textarea`: Multi-line text input
   - `switch`: Boolean toggle/checkbox

4. **Validation Rules**: The following validation rules are assumed to be supported:
   - `minLength`, `maxLength`: For text and textarea fields
   - `regex`: For text fields (email validation, etc.)
   - `min`, `max`: For number fields
   - `minDate`: For date fields
   - `minSelected`, `maxSelected`: For multi-select fields

5. **Environment**: Assumes Node.js and npm are installed and properly configured on the system.

6. **CORS**: The backend is configured to accept requests from any origin. In production, this should be restricted to specific allowed origins.

7. **Port Configuration**: Backend defaults to port 3000 and frontend to port 5173. These can be changed via environment variables or configuration files.

8. **Data Storage**: Form submission data is stored as JSON in the database, allowing for flexible schema changes without database migrations.

## Project Structure

```
matbook-backend/
├── backend/
│   ├── db.js                 # Prisma client configuration
│   ├── index.js              # Express server and API routes
│   ├── formSchema.json       # Form schema definition
│   ├── validate.js           # Zod schema builder
│   ├── middleware/
│   │   └── validateForm.js   # Form validation middleware
│   ├── prisma/
│   │   └── schema.prisma     # Prisma database schema
│   └── generated/            # Generated Prisma client
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main app component with routing
│   │   ├── Pages/
│   │   │   ├── DynamicFormPage.tsx    # Dynamic form page
│   │   │   └── SubmissionsPage.tsx     # Submissions list page
│   │   └── types/
│   │       └── formSchema.ts # TypeScript type definitions
│   └── vite.config.ts        # Vite configuration
└── package.json              # Root package.json
```

## License

ISC

