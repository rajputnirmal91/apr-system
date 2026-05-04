# Appraisal System Frontend Setup

<!-- ## Prerequisites -->

Before starting, make sure you have the following installed on your system:

- **Node.js** (version > 18)
- **Yarn** package manager

---

<!-- # Step 1: Navigate to the Frontend folder -->

Open your terminal and run:

```bash
cd Frontend

# Step 2: Switch to the develop branch

Check your current branch and switch to Develop:
git checkout Develop


# Step 3: Install dependencies

Install all required packages using Yarn:
yarn install

# Step 4: Create and configure .env file

Create a .env file inside the Frontend folder and add the following environment variables:

VITE_PORT=7000
VITE_ROUTER_BASE_PATH="/"
VITE_API_BASE_URL=http://125.99.189.203:8085
VITE_WEBSITE_URL=http://localhost:7000
VITE_APP_SECRET_KEY=PROJECT@lmsin$123



# Step 5: Run the development server

Start the frontend application using:
yarn run dev

# to check server is running or not

Once the server is running, you can access the app at:
http://localhost:7000