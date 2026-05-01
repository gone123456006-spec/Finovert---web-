# 🚀 Finovert Deployment Guide

Your application is now configured for a split deployment:
- **Frontend**: Hosted on [Vercel](https://vercel.com)
- **Backend**: Hosted on [Render](https://render.com)

---

## 1. Deploying the Backend (Render)
We use a Blueprint (`render.yaml`) to automate the backend setup.

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file.
5. You will be prompted to enter:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `CLIENT_ORIGIN`: Your deployed Vercel frontend URL (e.g., `https://finovert.vercel.app`).
6. Click **Apply**.
7. Once deployed, **copy your Render backend URL** (e.g., `https://finovert-backend.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)
Vercel is natively configured to build your frontend.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project** and select your GitHub repository.
3. In the **Configure Project** screen:
   - **Root Directory**: Click Edit and type `frontend`.
4. In **Environment Variables**, add:
   - Name: `VITE_API_URL`
   - Value: *(Paste the backend URL you copied from Render)*
5. Click **Deploy**.

## 3. Post-Deployment Checklist
- [ ] Ensure your MongoDB Atlas IP Access List allows connections from everywhere (`0.0.0.0/0`) so Render can connect.
- [ ] Check Vercel to ensure there are no 404 errors on refresh (this is handled automatically if the Root Directory is set correctly).
