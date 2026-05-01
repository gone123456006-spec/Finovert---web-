# 🚀 Finovert Deployment Guide (Render.com)

This guide explains how to deploy your monorepo (Frontend + Backend) to Render using the Blueprint feature.

## 1. Prerequisites
- A [Render.com](https://render.com) account.
- Your code pushed to a GitHub or GitLab repository.
- A MongoDB database (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

## 2. Deployment Steps

### Method A: Using the Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file.
5. It will show you the two services: `finovert-backend` and `finovert-frontend`.
6. **Important**: You will be prompted to enter the `MONGODB_URI`.
   - Paste your MongoDB Atlas connection string here.
7. Click **Apply**.

### Method B: Manual Configuration
If you prefer to set them up manually:

#### **Backend (Web Service)**
- **Name**: `finovert-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start --workspace=backend`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `MONGODB_URI`: (Your connection string)
  - `CLIENT_ORIGIN`: (The URL of your frontend once deployed)

#### **Frontend (Static Site)**
- **Name**: `finovert-frontend`
- **Build Command**: `npm install && npm run build --workspace=frontend`
- **Publish Directory**: `frontend/dist`
- **Environment Variables**:
  - `VITE_API_URL`: (The URL of your backend once deployed)
- **Redirects/Rewrites**:
  - Add a "Rewrite" rule: Source `/*` -> Destination `/index.html` (Required for React Router).

## 3. Post-Deployment Checklist
- [ ] Check the **Events** tab in Render to ensure the build finished successfully.
- [ ] Verify that the `VITE_API_URL` is correctly set (it should not have a trailing slash unless your code expects it).
- [ ] Ensure your MongoDB Atlas IP Access List allows connections from everywhere (`0.0.0.0/0`) or specific Render IP addresses.

## 4. Troubleshooting
- **CORS Errors**: Ensure `CLIENT_ORIGIN` in the backend matches the frontend URL exactly (including `https://`).
- **Frontend 404 on Refresh**: Ensure the Rewrite rule is set in the Static Site settings on Render.
- **Vite Build Failures**: Ensure you are using a compatible Node version (Render uses 18+ by default which matches your `package.json`).
