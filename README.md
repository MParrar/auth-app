# Full Stack Project: Node.js API and React with Vite (Authentication)

This project is a full-stack application that includes a Node.js API backend with authentication and a React frontend built with Vite. The project uses JWT (JSON Web Tokens) for secure authentication and user session management.

## Prerequisites
Before starting, make sure you have:

  - Node.js (21.1.0)
  - npm or yarn (package manager)
  - Git (optional, for cloning the repository)

    
## Installation 

Install auth-app with npm

```bash
git clone https://github.com/MParrar/auth-app.git
cd auth-app
```
Setup Backend \
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm instal 
```
Create a .env file for environment variables and add variables
```bash
PORT=<YOUR_PORT>
DATABASE_URL=<YOUR_DATABASE_URL>
DATABASE_URL_TEST=<YOUR_DATABASE_URL_TEST>
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRATION=<AMOUNT_TIME>
FRONTEND_URL=<YOUR_FRONTEND_URL>
API_KEY_EMAIL=<YOUR_API_KEY_FROM_MAILSENDER>
EMAIL_SENDER=<YOUR_EMAIL_SENDER_FROM_MAILSENDER>
```
Start the backend server:
```bash
npm run dev
```
The server will be available at http://localhost:<PORT>.

Setup fronted \
Install auth-app with npm

Navigate to the fronted folder and install dependencies:
```bash
cd frontend
npm instal 
```
Create a .env file for environment variables and add variables
```bash
VITE_API_URL=<YOUR_API_URL>
VITE_LOGOUT_TIMEOUT_MINUTES=<YOUR_TIME_FOR_LOG_OUT>
```
Start the backend server:
```bash
npm run dev
```
The server will be available at http://localhost:5173.

# Description of the Architecture


This project follows a modular full-stack architecture, dividing the application into two main components: the backend (API) and the frontend (React application). Here's an overview of the architecture:

## Backend (Node.js API)
**Framework:** The backend is built using Express.js, a minimalist framework for building APIs.\
**Authentication:** The project uses JWT (JSON Web Tokens) for secure user authentication. Tokens are generated upon login and validated for protected routes.\
**Database:** The backend integrates with a relational database PostgreSQL to store user data and other resources (logs).\
**Middleware:** Custom middleware is used for tasks like:
Authentication validation.
Error handling.\
**Routing:** Routes are organized by feature (e.g., auth, users, admin) for better modularity.
Workflow:

Client sends HTTP requests to API endpoints (e.g., login, register, fetch data).
Backend processes the request, validates data, and interacts with the database.
Responses (e.g., success messages, JWT tokens, or errors) are sent back to the client.

## Frontend (React with Vite)
**Framework:** The frontend is built with React, using Vite as the build tool for a fast development experience.\
**Routing:** Client-side navigation is managed using React Router to allow seamless transitions between pages (e.g., login, dashboard).\
**State Management:**
Authentication state (e.g., storing JWT tokens) is managed using React Context API.
LocalStorage is used to persist authentication tokens between sessions.\
**API Communication:**
The frontend communicates with the backend via HTTP requests using Axios.
API calls are encapsulated in a services layer for reusability and cleaner code. \
**UI Components:** Reusable UI components (e.g., forms, buttons, protected routes) are organized for scalability using tailwind.

## Database Layer
**Database:** The project uses PostgreSQL hosted on Neon.\
**Schema:**
The database contains essential tables such as users (for authentication and user details) and other table for logs (audit_logs).
## CI/CD Workflow with GitHub Actions
The project uses GitHub Actions to automate the deployment of both the frontend and backend to Vercel whenever code is pushed to the main branch. Below is a breakdown of the workflow configuration:

### Workflow Name
Deploy Frontend and Backend to Vercel

### Trigger
The workflow is triggered on every push event to the main branch.

### Deploy
The workflow consists of a single deploy job that runs on an Ubuntu-latest runner. Here's a step-by-step explanation of what each part does:

- Checkout Repository: Uses the official actions/checkout action to clone the repository into the GitHub Actions runner, making the codebase available for further steps.
- Set Up Node.js: Configures the Node.js environment using actions/setup-node@v2 and sets the Node.js version to 21.1.0.
- Install Backend Dependencies: Navigates to the backend directory and installs all dependencies specified in the package.json file.
- Lint Backend Code: Runs the linter (npm run lint) to ensure code quality and adherence to standards in the backend.
- Run Backend Tests Executes the backend test suite (npm run test) to verify the functionality of the backend codebase. Uses environment variables (DATABASE_URL_TEST, API_KEY_EMAIL, JWT_SECRET, etc.) securely stored in GitHub Secrets to ensure tests run in a configured environment.
- Install Frontend Dependencies: Navigates to the frontend directory and installs all dependencies for the React application.
- Lint Frontend Code: Runs the linter on the frontend code (npm run lint) to check for code quality issues.
- Build Frontend: Builds the frontend application for production using the Vite build command (npm run build).
- Deploy Frontend to Vercel: Deploys the built frontend to Vercel using the amondnet/vercel-action GitHub Action. It uses the following environment variables stored in GitHub Secrets for authentication and deployment: VERCEL_TOKEN: Authentication token for Vercel. VERCEL_ORG_ID: Organization ID in Vercel. VERCEL_PROJECT_ID_FRONTEND: Vercel project ID for the frontend.
- Deploy Backend to Vercel: Deploys the backend to Vercel using the same amondnet/vercel-action GitHub Action. Similar to the frontend deployment, it uses the following environment variables: VERCEL_TOKEN: Authentication token for Vercel. VERCEL_ORG_ID: Organization ID in Vercel. VERCEL_PROJECT_ID_BACKEND: Vercel project ID for the backend.

## Future Improvements
While the current implementation is functional and deployable, there are several areas where the project could be enhanced for better scalability, maintainability, and developer experience:

### Use RBAC Model
Currently everything is stored in the user table, but this could evolve and use a model type rbac (Role-based access contro), where it contains user, role and related permissions to generate validations. 

### Database Management with an ORM

Currently, the database interactions are handled manually with raw SQL queries. Introducing an ORM (like Prisma or Sequelize) would:
Simplify database queries.
Provide better abstraction and schema migrations.
Improve developer productivity by offering type safety and reducing boilerplate code.
Transition to a NoSQL Database

### Consider migrating from PostgreSQL to a NoSQL database like MongoDB. 
This would
Allow for more flexible and scalable data modeling, especially for unstructured or semi-structured data.
Reduce the need for complex joins in certain use cases.
MongoDB can also integrate well with Neon for efficient cloud hosting.
### Authentication with Auth0

The current authentication mechanism could be replaced or enhanced using Auth0, which would:
Provide a secure and scalable identity management solution.
Simplify user authentication and authorization workflows.
Allow easy integration with social logins (e.g., Google, GitHub).
Reduce the need for managing sensitive data like JWT secrets and passwords manually.
Auth0 also supports using cookies (httpOnly and Secure cookies) for storing authentication tokens, which is a more secure approach than using local storage. This helps prevent XSS attacks and enhances security for session management.

### Improved Testing Coverage

Expand test coverage for both backend and frontend.
### Environment Configuration for Multiple Stages

Enhance the deployment pipeline to support multiple environments (e.g., development, staging, production) with separate configurations for each environment.

